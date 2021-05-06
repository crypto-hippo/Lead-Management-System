/* eslint-disable no-undef */
import React, {Component} from 'react';
import AddBatchModal from './AddBatchModal';
import axios from 'axios';
import BatchFileRow from './BatchFileRow';
import BatchValidator from '../validators/BatchValidator';
import '../scss/batch.scss';


axios.defaults.withCredentials = true;

export default class ManageBatch extends Component {
    constructor(props) {
        super(props);
        this.batchValidator = new BatchValidator();
        this.state = { 
            batchSelected: 'No Batch Selected',
            filter: 'All',
            showModal: false,
            pagination_start: 0,
            pagination_limit: 5,
            total_file_count: 0,
            files: [],
            loading: false,
            search: false,
            searchValue: ''
        }
    }

    fetchBatchFiles = () => {
        this.setState({loading: true});

        let dataObject = {
            start: this.state.pagination_start,
            limit: this.state.pagination_limit
        }

        axios.post(`/batch/fetch/files`, dataObject).then(response => {
            console.log(response)
            if (response.data.error) {
                alert("Error fetching leads.")
            } else {
                this.setState({files: response.data.files, total_file_count: response.data.count});
            }

            if (this.state.pagination_limit > this.state.total_file_count) {
                // this.setState({pagination_limit: this.state.total_file_count});
            }

            this.setState({loading: false});
        })
    }

    componentDidMount() {
        this.fetchBatchFiles();
    }

    showModal = () => {
        this.setState({showModal: true})
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    removeBatchFile = (e) => {

    }

    loadNext = () => {
        console.log("loading next");
        let nextStart = this.state.pagination_start + this.state.pagination_limit;
        if (nextStart < this.state.total_file_count) {
            this.setState({pagination_start: nextStart}, function() {
                this.fetchBatchFiles();
            });
        }
    }

    loadPrev = () => {
        if (this.state.pagination_start > 0) {
            let nextStart = this.state.pagination_start - this.state.pagination_limit;
            this.setState({loading: true, pagination_start: nextStart}, function() {
                this.fetchBatchFiles();
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

    onSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log("searching batch files");
            // if (this.state.searchValue.length === 0) {
            //     this.refreshSearch();
            // } else {
            //     this.setState({pagination_start: 0, search: true}, function() {
            //         this.searchLeads();
            //     });
            // }
        }
    }
    
    render = () => {
        const view_files = [];

        this.state.files.forEach(file => {
            let downloadLink = `/batch/download/${file.file_name}`;
            view_files.push(<BatchFileRow data={file} downloadLink={downloadLink} remove />);
        })

        return (
            <div className="dashboard-main">
                <div className="dashboard-header">
                    <div className="header-title">
                        <span className="header-text-primary">Manage Batch Leads : </span>
                        <span className="header-text-secondary">{this.state.batchSelected}</span>
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
                            {this.state.total_file_count}  
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
                            <i onClick={this.showModal} className="large plus circle icon"></i>
                        </span>
                    </div>

                </div>

                { this.state.total_file_count === 0 

                    ?

                    <div className="leads no-count">
                        <div className="no-lead-selected-text">There doesn't seem to be anything here</div>
                    </div>

                    :

                    <div className="leads">
                        {view_files}
                    </div>
                }
                

                <AddBatchModal isOpen={this.state.showModal} closeModal={this.closeModal} fetchBatchFiles={this.fetchBatchFiles} />
            </div>
        )
    }   
}