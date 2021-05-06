import React, {Component} from 'react';

export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSelected: 'No User Selected'
        }
    }

    render = () => 
        <div className="dashboard-main">
            <div className="dashboard-header">
                <div className="header-title">
                    <span className="header-text-primary">Manage Users : </span>
                    <span className="header-text-secondary">{this.state.userSelected}</span>
                </div>
            </div>
            <div className="dashboard-sub">
                <div className="sub-text">
                    [##]
                </div> 
            </div>
        </div>
}