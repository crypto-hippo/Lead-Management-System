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
            startMessage: '',
            messages: [],
            modalErrorMessage: '',
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

    resetBatchModal = () => {
        this.setState({
            fileName: '',
            description: {size: '', lastModified: '', lastModifiedTimeStamp: 0},
            leadsForUpload: [],
            modalErrorMessage: null,
            invalidLeads: [],
        })        
    }

    startMessageOnChange = (e) => {
        this.setState({startMessage: e.target.value});
    }

    onAfterClose = (e) => {
        this.resetBatchModal();
    }

    sendMessage = () => {
        if (this.state.startMessage.trim().length > 0) {
            this.setState({uploading: true});
            let data = {message: this.state.startMessage}
            axios.post('/campaign/message/send', data).then(response => {
                console.log(response);
                this.setState({uploading: false});
            }).catch(error => {
                console.log("axios error");
                this.setState({uploading: false});
            })
        } else {
            this.setState({modalErrorMessage: "Start Message must not be blank."})
        }
    }

    render() {
        let a = 1;
        return (
            <div>
                <Modal isOpen={this.props.isOpen} onAfterClose={this.onAfterClose} onAfterOpen={this.afterOpenModal} onRequestClose={this.props.closeModal} style={this.customStyles}>
                    <div className="modal-title">
                        Message Details

                        { this.state.uploading && 
                            <i class="fa fa-spinner fa-spin"></i>
                        }
                    </div>

                    { this.state.modalErrorMessage && 
                        <div className="modal-element">
                            <i className="modal-error">{this.state.modalErrorMessage}</i>
                        </div>        
                    }
                
                    <div className="modal-element modal-element-first">
                        <label htmlFor="start-message">Start Message</label>
                        <input className="start-message" id="start-message" type="text" placeholder="- -" value={this.state.startMessage} onChange={this.startMessageOnChange} />
                    </div>

                    <div className="modal-actions">
                        <button onClick={this.props.closeModal}>Cancel</button>
                        <button>
                            <i class="fa fa-paper-plane" aria-hidden="true" onClick={this.sendMessage}></i>
                        </button>
                    </div>

                </Modal>
            </div>
        );
    }
}