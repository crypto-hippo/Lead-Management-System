import React, {Component} from 'react';
import axios from 'axios';
import Campaign from './Campaign';
import '../scss/batch.scss';
import AddCampaignModal from './AddCampaignModal';
import SendMessageModal from './SendMessageModal';
import '../scss/animated_checkmark.scss';

export default class ManageCampaigns extends Component {
    constructor(props) {
        super(props);
        this.methodDict = {"sms": "Email", "email": "SMS"}
        this.typeDict = {"marketing": "Transactional", "transactional": "Marketing"};
        this.state = {
            campaignSelected: 'No Campaign Selected',
            loading: false,
            pagination_start: 0,
            pagination_limit: 50,
            total_campaign_count: 0,
            campaigns: [],
            search: false,
            searchValue: '',
            showModal: false,
            currentCampaign: null,
            convoCardError: '',
            convoCardUpdating: false,
            newCampaignName: '',
            newCampaignMethod: '',
            newCampaignType: '',
            newCampaignDescription: '',
            fromEmail: '',
            showMessageModal: false,
        }
    }
    
    fetchCampaigns = () => {
        this.setState({loading: true});

        let dataObject = {
            start: this.state.pagination_start,
            limit: this.state.pagination_limit
        }

        axios.post(`/campaign/fetch`, dataObject).then(response => {
            console.log(response)
            if (response.data.error) {
                alert("Error fetching campaigns.")
            } else {
                console.log(response.data)
                this.setState({campaigns: response.data.campaigns, total_campaign_count: response.data.count});
            }

            if (this.state.pagination_limit > this.state.total_campaign_count) {
                // this.setState({pagination_limit: this.state.total_campaign_count});
            }

            this.setState({loading: false});
        })
    }

    toggleSearch = () => {
        this.setState({search: !this.state.search})
    }

    onSearchInput = (e) => {
        this.setState({searchValue: e.target.value.trim()})
    }

    onSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log("searching campaigns");
            // if (this.state.searchValue.length === 0) {
            //     this.refreshSearch();
            // } else {
            //     this.setState({pagination_start: 0, search: true}, function() {
            //         this.searchLeads();
            //     });
            // }
        }
    }

    loadNext = () => {
        console.log("loading next");
        let nextStart = this.state.pagination_start + this.state.pagination_limit;
        if (nextStart < this.state.total_campaign_count) {
            this.setState({pagination_start: nextStart}, function() {
                this.fetchCampaigns();
            });
        }
    }

    loadPrev = () => {
        if (this.state.pagination_start > 0) {
            let nextStart = this.state.pagination_start - this.state.pagination_limit;
            this.setState({loading: true, pagination_start: nextStart}, function() {
                this.fetchCampaigns();
            });
        }
    }

    showModal = () => {
        this.setState({showModal: true})
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    componentDidMount = () => {
        this.fetchCampaigns();
    }

    byName = (campaignName) => {
        let i = 0, numCampaigns = this.state.campaigns.length, currentCampaign;

        for (i; i < numCampaigns; i++) {
            let currentCampaign = this.state.campaigns[i];
            if (currentCampaign.name === campaignName) {
                return currentCampaign
            }
        }

        return null;
    };

    nameOnClick = (e) => {
        let campaignSelected = e.target.innerText;
        let campaign = this.byName(campaignSelected);
        if (campaign) {
            this.setState({
                campaignSelected: campaignSelected,
                currentCampaign: campaign,
                newCampaignName: campaignSelected,
                newCampaignType: campaign.type,
                newCampaignMethod: campaign.method,
                newCampaignDescription: campaign.description
            });
        }
    }

    getViewCampaign = () => {
        return {
            name: this.state.newCampaignName,
            type: this.state.newCampaignType,
            method: this.state.newCampaignMethod,
            description: this.state.newCampaignDescription
        }
    }

    campaignsEqual = (c1, c2) => {
        return (c1.name === c2.name &&
            c1.type === c2.type &&
            c1.method === c2.method &&
            c1.description === c2.description);
    }

    campaignUpdated = (campaign) => {
        let campaigns = this.state.campaigns;
        this.setState({campaigns: campaigns.map((c) => {
            if (c.id == campaign.id) {
                return campaign;
            } else {
                return c;
            }
        })}, () => {
            this.nameOnClick({target: {innerText: campaign.name}});
        });
    }

    invalidCampaign = (campaign) => {
        return (campaign.name.trim().length === 0 ||
            campaign.type.trim().length === 0 ||
            campaign.method.trim().length === 0)    
    }

    campaignNameExists = (name, id) => {
        let i;
        let len = this.state.campaigns.length;
        let currentCampaign;
        for (let i = 0; i < this.state.campaigns.length; i++) {
            currentCampaign = this.state.campaigns[i];
            if (currentCampaign.name === name && currentCampaign.id !== id) {
                return true;
            }
        }

        return false;
    }

    updateCampaign = () => {
        if (this.state.currentCampaign !== null) {
            let currentCampaignValues = this.getViewCampaign();
            console.log(currentCampaignValues);
            if (this.campaignsEqual(currentCampaignValues, this.state.currentCampaign)) {
                console.log("campaigns are equal, no changes made")
            } else if (this.invalidCampaign(currentCampaignValues)) {
                this.setState({convoCardError: "Name, Type, and Method are required fields."});
            } else if (this.campaignNameExists(currentCampaignValues.name, this.state.currentCampaign.id)) {
                this.setState({convoCardError: 'The campaign name already exists.'});
            } else {
                this.setState({convoCardUpdating: true})
                currentCampaignValues.id = this.state.currentCampaign.id;
                axios.post('/campaign/update', {campaign: currentCampaignValues}).then(response => {
                    console.log(response);
                    if (response.data.error) {
                        this.setState({convoCardError: response.data.error_message})
                    } else {
                       let updatedCampaign = response.data.campaign;
                       this.campaignUpdated(updatedCampaign);
                       this.setState({convoCardError: false});
                    }

                    this.setState({convoCardUpdating: false});
                });
            }
        } 
    }

    updateDescription = (e) => {
        this.setState({newCampaignDescription: e.target.value})
    }

    updateName = (e) => {
        this.setState({newCampaignName: e.target.value});
    }

    updateMethod = (e) => {
        this.setState({newCampaignMethod: e.target.value});
    }

    updateType = (e) => {
        this.setState({newCampaignType: e.target.value});
    }

    showMessageModal = () => {
        this.setState({showMessageModal: true});
    }

    closeMessageModal = () => {
        this.setState({showMessageModal: false});
    }

    updateFromEmail = (e) => {
        this.setState({fromEmail: e.target.value});
    }

    
    render = () => {
        const view_campaigns = [];

        this.state.campaigns.forEach(campaign => {
            // let downloadLink = `/batch/download/${file.file_name}`;
            view_campaigns.push(<Campaign data={campaign} nameOnClick={this.nameOnClick.bind(this)} />);
        })

        return (
            <div className="campaign-dashboard-container">
                <div className="dashboard-main campaign-dashboard">
                    <div className="dashboard-header">
                        <div className="header-title">
                            <span className="header-text-primary">Manage Campaigns : </span>
                            <span className="header-text-secondary">{this.state.campaignSelected}</span>
                        </div>
                    </div>
                    <div className="dashboard-sub">
                        <div className="sub-text">
                            <span>Displaying</span>
                            <span className="pagination" onClick={this.loadPrev.bind(this)} >
                                <i className="fa fa-2x fa-angle-left"></i>    
                            </span>

                            <span className="pagination">
                                {this.state.pagination_start} 
                            </span>

                            <span>
                                -
                            </span>

                            <span className="pagination">
                                {this.state.pagination_start + this.state.pagination_limit} 
                            </span>

                            <span>
                                of
                            </span>

                            <span className="pagination">
                                {this.state.total_campaign_count}  
                            </span>

                            <span className="pagination" onClick={this.loadNext.bind(this)}>
                                <i className="fa fa-2x fa-angle-right"></i>  
                            </span>

                            { this.state.loading && 
                                <i className="fa fa-2x fa-spin fa-spinner" ></i>
                            }

                        </div> 

                        <div className="sub-right">
                            <span className="filter-by">
                                <span>Filter by : {this.state.filter} : # </span>  
                                <i className="large ellipsis vertical icon" ></i>
                                
                                { this.state.search && 
                                    <div class="ui search">
                                        <div class="ui icon input">
                                            <input class="prompt" type="text" placeholder="Search Leads!" onInput={this.onSearchInput.bind(this)} onKeyPress={this.onSearchKeyPress.bind(this)} />
                                            <i class="search icon" onClick={this.toggleSearch.bind(this)}></i>
                                        </div>
                                        <div class="results"></div>
                                    </div>
                                }
                                
                                <i className="large search icon" onClick={this.toggleSearch.bind(this)}></i> 
                                <i class="large plus circle icon" aria-hidden="true" onClick={this.showModal}></i>

                            </span>
                        </div>
                    </div>

                    { this.state.total_campaign_count === 0

                        ?

                        <div className="leads no-count">
                            <div className="no-lead-selected-text">There doesn't seem to be anything here</div>
                        </div>

                        : 

                        <div className="leads">
                            {view_campaigns}
                        </div>
                    }
                    
                </div>

                <div className="lead-convo-card">
                    <div className="lead-convo-header">
                        <span className="header-text-primary">
                            Campaign Info > Details : {this.state.campaignSelected}
                        </span>
                        
                        { this.state.convoCardError && <i className="convo-card-error">{this.state.convoCardError}</i>}

                        <div className="convo-actions">
                            <div className="check-container">
                                {/* <i className="fa fa-2x fa-check-circle"></i> */}
                                <label class="label">
                                    <input className="label__checkbox" type="checkbox" />
                                    <span className="label__text">
                                        <span className="label__check">
                                            <i className="fa fa-check doit"></i>
                                        </span>
                                    </span>
                                </label> 
                            </div>

                            
                            {/* <i className={"fa fa-refresh " + (this.state.convoCardUpdating ? 'fa-spin' : '') } onClick={this.updateCampaign}></i> */}
                        </div>
                        
                    </div> 

                    { this.state.campaignSelected === "No Campaign Selected" 
                    
                        ?

                        <div className="lead-convo-body no-lead-selected">
                            <span className="no-lead-selected-text">Please select a Campaign to view it's Details</span>
                        </div>

                        : 

                        <div className="lead-convo-body">
                            <div className="ui grid campaign-grid">
                                <div className="four wide column">
                                    <label htmlFor="current-name">Campaign Name</label>
                                    <input id="current-name" type="text" value={this.state.newCampaignName} onChange={this.updateName} />
                                </div>
                                <div className="four wide column">
                                    <label htmlFor="current-type">Campaign Type</label>
                                    <select id="current-type" onChange={this.updateType}>
                                        <option>{this.state.currentCampaign.type}</option>
                                        <option>{this.typeDict[this.state.currentCampaign.type.toLowerCase()]}</option>
                                    
                                    </select>
                                </div>
                                <div className="four wide column">
                                    <label htmlFor="current-method">Campaign Method</label>
                                    <select id="current-method" onChange={this.updateMethod} value={this.state.currentCampaign.method}>
                        
                                        
                                    </select>
                                </div>
                                <div className="four wide column"></div>

                                <div className="four wide column">
                                    <label htmlFor="current-description">Description</label>
                                    <input id="current-description" type="text" value={this.state.newCampaignDescription} onChange={this.updateDescription} />
                                </div>

                                <div className="four wide column"></div>
                            </div>

                            <div className="ui grid campaign-grid"></div>
                        </div>
                    }
                </div>

                <AddCampaignModal isOpen={this.state.showModal} closeModal={this.closeModal} fetchCampaigns={this.fetchCampaigns}/>
                <SendMessageModal isOpen={this.state.showMessageModal} closeModal={this.closeMessageModal} />
            </div>
        )
    }
}