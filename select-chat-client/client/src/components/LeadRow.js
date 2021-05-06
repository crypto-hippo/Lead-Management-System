import React, {Component} from 'react';

export default class LeadRow extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            
            <div className="batch-lead-row">
                {this.props.data.status === 'active' 
                    ?

                    <i className="fa fa-2x fa-star active" aria-hidden="true"></i>
                    : 

                    <i className="fa fa-2x fa-star inactive" aria-hidden="true"></i>
                }
                <i class="fa fa-2x fa-comment" aria-hidden="true"></i>
                <a onClick={this.props.selectLead} className="lead-name-link">{this.props.data.first_name + " " + this.props.data.last_name}</a>
                <span className="batch-key"> Campaign: <span className="batch-value">{this.props.data.selectchat_campaign_id}</span></span>
                <span className="batch-key"> Status: <span className="batch-value">{this.props.data.status}</span></span>

                <a target="_blank" class="fa fa-2x fa-download" aria-hidden="true" href={this.props.downloadLink} rel="noopener noreferrer"></a>

            </div>
        )
    }
}
