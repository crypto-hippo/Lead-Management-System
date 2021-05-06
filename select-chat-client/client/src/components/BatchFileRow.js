
import React, {Component} from 'react';

export default class BatchFileRow extends Component {

    constructor(props) {
        super(props);
    }

    render = () =>
        <div className="batch-lead-row">
            <span className="file-name"><b>{ this.props.data.file_name } </b></span>
            
            <span className="batch-key">Uploaded on: <span className="batch-value">{this.props.data.upload_date.split("T")[0]}</span></span>
            
            <span className="batch-key">Uploaded by: <span className="batch-value">{this.props.data.first_name + " " + this.props.data.last_name}</span></span>
            
            <span className="batch-key">Lead Count: <span className="batch-value">{this.props.data.lead_count}</span></span>

            <a target="_blank" className="fa fa-2x fa-download" aria-hidden="true" href={this.props.downloadLink}></a>
            <i className="fa fa-2x fa-trash" aria-hidden="true" onClick={this.props.removeBatchFile}></i>

        </div>
}