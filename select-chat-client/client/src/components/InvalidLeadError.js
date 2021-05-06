import React, {Component} from 'react';

export default class InvalidLeadError extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            
            <div className="invalid-lead-error">
                <span className="error-key">Line: <span className="error-value">{this.props.data.line}</span></span>
                <span className="error-key">Error: <span className="error-value">{this.props.data.error_message}</span></span>
            </div>
        )
    }
}
