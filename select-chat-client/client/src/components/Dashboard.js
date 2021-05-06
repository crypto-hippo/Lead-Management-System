import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import LeftNav from './LeftNav';
import ManageUsers from './ManageUsers';
import ManageLeads from './ManageLeads';
import ManageCampaigns from './ManageCampaigns';
import ManageBatch from './ManageBatch';
import Header from './Header';
import '../scss/dashboard.scss';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <div className="page">
                <Header user={this.props.user} onGoogleLogout={this.props.onGoogleLogout}/>
                <div className="dashboard ui grid">
                    <Route path="/dashboard/users">
                        <LeftNav active='users'/>
                        <ManageUsers />
                    </Route>

                    <Route path="/dashboard/leads">
                        <LeftNav active='leads'/>
                        <ManageLeads />
                    </Route>

                    <Route path="/dashboard/campaigns">
                        <LeftNav active='campaigns'/>
                        <ManageCampaigns />
                    </Route>

                    <Route path="/dashboard/batch">
                        <LeftNav active='batch'/>
                        <ManageBatch />
                    </Route>
                </div>
            </div>
            
        )
    }
}