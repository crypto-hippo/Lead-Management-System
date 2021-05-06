import React, {Component} from 'react';
import LeadRow from './LeadRow';
import '../scss/batch.scss';
import axios from 'axios';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'

export default class ManageLeads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leadSelected: 'No Lead Selected',
            uploadDate: '',
            pagination_start: 0,
            pagination_limit: 50,
            leads: [],
            total_lead_count: 0,
            conversationSelected: 'No Item Selected',
            loading: false,
            search: false,
            searchValue: '',
        }
    }


    fetchLeads() {

        this.setState({loading: true});

        if (this.state.search) {
            this.searchLeads();
        } else {
            let dataObject = {
                start: this.state.pagination_start,
                limit: this.state.pagination_limit
            }
    
            axios.post(`/batch/fetch/leads`, dataObject).then(response => {
                if (response.data.error) {
                    alert("Error fetching leads.")
                } else {
                    console.log("response", response);
                    this.setState({leads: response.data.leads, total_lead_count: response.data.count});
                }
    
                this.setState({loading: false});
            })
        }
        
    }

    componentDidMount() {
        this.fetchLeads();
    }

    getLeadSelected(name) {
        let leads = this.state.leads;
        for (var i = 0; i < leads.length; i++) {
            let lead = leads[i];
            if (lead.first_name + ' ' + lead.last_name === name) {
                return lead;
            }
        }
    }

    selectLead = (e) => {
        let leadSelected = this.getLeadSelected(e.target.innerText);
        this.setState({leadSelected: e.target.innerText,uploadDate: leadSelected.upload_date});
    }

    loadNext = () => {
        console.log("loading next");
        let nextStart = this.state.pagination_start + this.state.pagination_limit;
        if (nextStart < this.state.total_lead_count) {
            this.setState({pagination_start: nextStart}, function() {
                this.fetchLeads();
            });
        }
    }

    loadPrev = () => {
        if (this.state.pagination_start > 0) {
            let nextStart = this.state.pagination_start - this.state.pagination_limit;
            this.setState({loading: true, pagination_start: nextStart}, function() {
                this.fetchLeads();
            });
        }
    }

    toggleSearch = () => {
        console.log("okkkk")
        this.setState({search: !this.state.search})
    }

    onSearchInput = (e) => {
        this.setState({searchValue: e.target.value.trim()})
    }

    refreshSearch = () => {
        this.setState({pagination_start: 0, search: false}, () => {
            this.fetchLeads();
        })
    }

    searchLeads = () => {
        this.setState({loading: true})
        let args = {start: this.state.pagination_start, limit: this.state.pagination_limit, search: this.state.searchValue};
        axios.post("/batch/search/leads", args).then(response => {
            console.log(response);
            this.setState({leads: response.data.leads, total_lead_count: response.data.count});
            this.setState({loading: false});
        });
    }

    onSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            if (this.state.searchValue.length === 0) {
                this.refreshSearch();
            } else {
                this.setState({pagination_start: 0, search: true}, function() {
                    this.searchLeads();
                });
            }
        }
    }

    render = () => { 
        const view_leads = [];
        console.log(this.state.leads);
        this.state.leads.forEach(lead => {
            view_leads.push(<LeadRow data={lead} selectLead={this.selectLead}/>)
        });

        return (
            <div className="leads-dashboard-container">
                <div className="dashboard-main leads-dashboard">
                    <div className="dashboard-header">
                        <div className="header-title">
                            <span className="header-text-primary">Manage Leads : </span>
                            <span className="header-text-secondary">{this.state.leadSelected}</span>
                        </div>
                    </div>
                    <div className="dashboard-sub">
                        <div className="sub-text">
                        <span>Displaying</span>

                        <span className="pagination" onClick={this.loadPrev.bind(this)} >
                            <i className="fa fa-2x fa-angle-left" ></i>    
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
                            {this.state.total_lead_count}  
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
                            </span>
                        </div>
                    </div>

                    { this.state.total_lead_count === 0 
                    
                        ? 

                        <div className="leads no-count">
                            <div className="no-lead-selected-text">There doesn't seem to be anything here.</div>
                        </div>

                        :

                        <div className="leads">
                            {view_leads}
                        </div>

                    }       
                </div>
                

                <div className="lead-convo-card">
                    <div className="lead-convo-header">
                        <span className="header-text-primary">
                            Lead Info > Conversation : {this.state.conversationSelected}
                        </span>

                        <span className={"convo-card-options " + (this.state.uploadDate !== '' ? 'convo-enabled' : '')}>
                            <span className='conversation'>CONVERSATION</span>
                            
                            <Dropdown item icon='' className='fa fa-2x fa-ellipsis-v' simple>
                                <Dropdown.Menu className="user-nav-menu">
                                    <Dropdown.Item>
                                        <span>Profile Details</span>
                                    </Dropdown.Item>
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </span>
                    </div> 

                    { this.state.leadSelected !== 'No Lead Selected' 
                        
                        ?

                        <div className="lead-convo-body">
                            <div className="lead-body-title">
                                <i className="fa fa-2x fa-check-circle"></i>
                                <span className="lead-text">Lead Info: {this.state.leadSelected}</span>
                                <span className="vertical-rule"> | </span>
                                <span className="lead-text">Date Added: {this.state.uploadDate}</span>
                            </div>
                            <div className="lead-body-subtitle">
                                <div className="lead-message-sent-icon">S</div>
                                <div className="lead-message-sent">
                                    
                                    <i class="fa fa-2x fa-envelope"></i>

                                    <span className="lead-text">
                                        Message Sent: [Timestamp]
                                    </span>
                                </div>
                            </div>
                        </div>

                        :

                        <div className="lead-convo-body no-lead-selected">
                            <div className="no-lead-selected-text">Please select a Lead to view it's Details.</div>
                        </div>
                    
                    }
                        
                    
                </div>
            </div>
        )
    }
}