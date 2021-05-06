/* eslint-disable no-undef */
import React, {Component} from 'react';
import Modal from 'react-modal';
import '../scss/add_batch_modal.scss';
import axios from 'axios';
import BatchValidator from '../validators/BatchValidator';
import InvalidLeadError from './InvalidLeadError';

axios.defaults.withCredentials = true;

Modal.setAppElement("#root")

export default class AddBatchModal extends Component {

    constructor(props) {
        super(props);
        this.batchValidator = new BatchValidator();
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.customStyles = {
            content : {
                height: "80%",
                margin: "0 auto",
            }
        };

        this.state = {
            uploading: false,
            fileUploaded: false,
            fileName: '',
            description: {size: '', lastModified: '', lastModifiedTimeStamp: 0},
            leadsForUpload: [],
            modalErrorMessage: null,
            invalidLeads: []
        }
    }
       
    afterOpenModal() {
        console.log("Modal is open");
    }
    
    getFileSize = (numBytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (numBytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(numBytes) / Math.log(1024)));
        return Math.round(numBytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    getFileContents = (f) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsText(f, 'utf-8');
            fileReader.onload = function(event) {
                resolve(event.target.result);
            }
        });
    }

    fileUploaded = event => {
        console.log("event", event)
        let f = event.target.files[0];
        this.setState({
            fileName: f.name,
            fileUploaded: true,
            description: {
                size: this.getFileSize(f.size),
                lastModified: f.lastModifiedDate,
                lastModifiedTimeStamp: f.lastModified
            }
        })

        this.getFileContents(f).then(result => {
            let leads = this.getLeads(result);
            if (leads.invalidLeads.data.length > 0) {
                this.setState({invalidLeads: leads.invalidLeads.data})
            } else {
                this.setState({leadsForUpload: leads.leads.data});
            }
        })
    }

    getLeads = (result) => {
        let lines = result.split("\n");
        let leads = {data: []}
        let invalidLeads = {data: []};
        let index;
        let line;
        for (index = 0; index < lines.length; index++) {
            line = lines[index].trim();
            if (line) {
                let columns = line.split(",");
                if (columns.length === 8) {
                    let result = this.batchValidator.validateRecord(columns);
                    if (result.error) {
                        invalidLeads.data.push({error:true, error_message: `Invalid Column: ${result.error}`, line: index});
                    } else {
                        // lead is valid
                        leads.data.push(columns);
                    }
                } else {
                    invalidLeads.data.push({error: true, line: index, error_message: `Each row should contain 8 columns`});
                }
            }
        }

        return {leads: leads, invalidLeads: invalidLeads};
    }

    promptFile = () => {
        
        window.fileInput = document.createElement("input");
        window.fileInput.type = "file";
        window.fileInput.onchange = this.fileUploaded;

        window.fileInput.click();
    }

    uploadFile = () => {
        console.log("doit");
        if (this.state.fileUploaded) {
            console.log("anything")
            this.setState({uploading: true});
            let self = this;
            let fileObject = {
                name: self.state.fileName,
                size: self.state.description.size,
                lastModified: self.state.description.lastModifiedTimeStamp,
                contents: self.state.leadsForUpload,
            }           

            axios.post('/batch/upload', fileObject).then(response => {
                console.log(response);
                if (response.data.error) {
                    if (response.data.invalid_leads) {
                        this.setState({invalidLeads: response.data.invalid_leads})
                    } else {
                        this.setState({modalErrorMessage: response.data.error_message})
                    }

                } else {
                    // success, close modal and load the leads that were stored
                    this.props.closeModal();
                    this.props.fetchBatchFiles();
                }

                self.setState({uploading: false})
            }).catch(error => {
                this.setState({uploading: false})
                this.setState({modalErrorMessage: "Cannot upload file. Please try again later."})
            });
        } else {
            this.setState({modalErrorMessage: "No valid file specified."})
        }
    }

    fileNameOnChange = (e) => {
        let updatedFileName = e.target.value;
        this.setState({fileName: updatedFileName})
    }

    resetBatchModal = () => {
        this.setState({
            fileName: '',
            description: {size: '', lastModified: '', lastModifiedTimeStamp: 0},
            leadsForUpload: [],
            modalErrorMessage: null,
            invalidLeads: [],
            fileUploaded: false,
        })        
    }

    onAfterClose = (e) => {
        this.resetBatchModal();
    }

    render() {
        let view_invalid_leads = [];

        this.state.invalidLeads.forEach(invalid_lead => {
            view_invalid_leads.push(
               <InvalidLeadError data={invalid_lead} /> 
            )
        })

        return (
            <div>
                <Modal isOpen={this.props.isOpen} onAfterClose={this.onAfterClose} onAfterOpen={this.afterOpenModal} onRequestClose={this.props.closeModal} style={this.customStyles}>
                    <div className="modal-title">
                        Add New Batch

                        { this.state.uploading && 
                            <i class="fa fa-spinner fa-spin"></i>
                        }
                        
                    </div>

                    
                    { this.state.modalErrorMessage && 
                        <div className="modal-element">
                            <i className="modal-error">{this.state.modalErrorMessage}</i>
                        </div>        
                    }
                

                    <div className="modal-subtitle">[Upload process description]</div>

                    
                    <div className="modal-element">
                        <button className="btn-primary" onClick={this.promptFile}>Choose File</button>
                    </div>
                
                    <div className="modal-element">
                        <label htmlFor="file-name">File Name</label>
                        <input className="fileName" id="file-name" type="text" placeholder="- -" value={this.state.fileName} onChange={this.fileNameOnChange} />
                    </div>

                    <div className="modal-element">
                        <label htmlFor="description">Description</label>
                        <input id="description" type="text" placeholder='- -' value={this.state.description.size} readonly disabled />
                        <input type="text" placeholder='- -' value={this.state.description.lastModified} readonly disabled />
                    </div>

                    <div className="modal-actions">
                        <button onClick={this.props.closeModal}>Cancel</button>
                        <button onClick={this.uploadFile} class={ !this.state.fileUploaded ? "action-disabled" : "" } disabled={!this.state.fileUploaded}>Upload</button>
                    </div>

                    { this.state.invalidLeads.length > 0 && 
                        <div className="lead-error-container">
                            {view_invalid_leads}
                        </div>
                    }
                </Modal>
            </div>
        );
    }
}