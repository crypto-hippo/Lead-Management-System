
import React, {Component} from 'react';

export default class Campaign extends Component {

    constructor(props) {
        super(props);
    }

    render = () =>
        <div className="batch-lead-row">
            <span className="lead-name-link" onClick={this.props.nameOnClick}><b>{ this.props.data.name } </b></span>
            
            <span className="batch-key">Type:<span className="batch-value">{this.props.data.type}</span></span>
            
            <span className="batch-key">Method: <span className="batch-value">{this.props.data.method}</span></span>
            
            <span className="batch-key">Description: <span className="batch-value">{this.props.data.description}</span></span>

        </div>
}