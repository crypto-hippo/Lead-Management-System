import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            page: null,
        }
    }

    viewUsers = () => {
        this.setState({redirect: true, page: '/dashboard/users'})
    }

    viewBatch = () => {
        this.setState({redirect: true, page: '/dashboard/batch'})
    }

    viewCampaigns = () => {
        this.setState({redirect: true, page: '/dashboard/campaigns'})
    }

    viewLeads = () => {
        this.setState({redirect: true, page: '/dashboard/leads'})
    }

    render = () =>
        <div className="left-nav-container">
            <div className="left-nav">
                <div onClick={this.viewUsers} className={`letter ${this.props.active === 'users' ? 'letter-active' : ''}`}>U</div>
                <div onClick={this.viewLeads} className={`letter ${this.props.active === 'leads' ? 'letter-active' : ''}`}>L</div>
                <div onClick={this.viewCampaigns} className={`letter ${this.props.active === 'campaigns' ? 'letter-active' : ''}`}>C</div>
                <div onClick={this.viewBatch} className={`letter ${this.props.active === 'batch' ? 'letter-active' : ''}`}>B</div>
            </div>

            { this.state.redirect &&
                <Redirect to={this.state.page} />
            }
        </div>
}