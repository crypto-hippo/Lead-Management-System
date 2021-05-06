import React, {Component} from 'react';
import Modal from 'react-modal';
import '../scss/add_batch_modal.scss';
import axios from 'axios';

axios.defaults.withCredentials = true;

Modal.setAppElement("#root")

export default class AddCampaignModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            campaignUploaded: false,
            disabled: true,
            campaignName: '',
            campaignType: '',
            campaignMethod: '',
            campaignDescription: '',
            modalErrorMessage: ''
        }
    }

    saveCampaign = () => {
        if (this.state.campaignName && this.state.campaignType && this.state.campaignMethod) {
            this.setState({uploading: true});
            let campaign = {name: this.state.campaignName, type: this.state.campaignType, method: this.state.campaignMethod, description: this.state.campaignDescription}
            axios.post('/campaign/save', campaign).then(resp => {
                console.log(resp);
                if (resp.data.error) {
                    this.state.modalErrorMessage = resp.data.error_message;
                } else {
                    this.props.closeModal();
                    this.props.fetchCampaigns();
                }
                this.setState({uploading: false});
            })
        } else {
            this.setState({modalErrorMessage: "All fields are required."})
        }
    }

    checkFormDisabled = () => {
        if (this.state.campaignName.length > 0 && this.state.campaignType.length > 0 && this.state.campaignMethod.length > 0) {
            this.setState({disabled: false})
        }
            
        else {
            this.setState({disabled: true})
        }
    }

    campaignTypeOnChange = (e) => {
        this.setState({campaignType: e.target.value.trim()}, function() {
            this.checkFormDisabled();
        })
    }

    campaignMethodOnChange = (e) => {
        this.setState({campaignMethod: e.target.value.trim()}, function() {
            this.checkFormDisabled();
        });
    }

    campaignNameOnChange = (e) => {
        this.setState({campaignName: e.target.value.trim()}, function() {
            this.checkFormDisabled();
        });
    }

    campaignDescriptionOnChange = (e) => {
        this.setState({campaignDescription: e.target.value.trim()}, function() {
        
        });
    }

    refreshModal= () => {
        this.setState({
            modalErrorMessage: '',
            campaignName: '',
            campaignType: '',
            campaignMethod: '',
        })
    }

    onAfterClose = () => {
        this.refreshModal();
    }

    render = () => {
        return (
                <div>
                    <Modal isOpen={this.props.isOpen} onAfterClose={this.onAfterClose} onAfterOpen={this.aferOpenModal} onRequestClose={this.props.closeModal} >
                        <div className="modal-title">
                            Add New Campaign

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
                            <label for="campaign-name">Campaign Name</label>
                            <input id="campaign-name" type="text" placeholder="- -" onChange={this.campaignNameOnChange} />
                        </div>

                        <div className="modal-element">
                            <label for="campaign-type">Campaign Type</label>
                            <select id="campaign-type" type="text" onChange={this.campaignTypeOnChange}>
                                <option value="" selected disabled hidden>- -</option>
                                <option>Marketing</option>
                                <option>Transactional</option>
                            </select>
                        </div>

                        <div className="modal-element">
                            <label for="method">Method</label>
                            <select id="method" type="text" onChange={this.campaignMethodOnChange}>
                                <option value="" selected disabled hidden>- -</option>
                                <option>Email</option>
                                <option>SMS</option>
                            </select>
                        </div>

                        <div className ="modal-element">
                            <label for="desc">Description (optional)</label>
                            <input id="desc" type="text" placeholder="- -" onChange={this.campaignDescriptionOnChange} />
                        </div>
                        <div className="modal-actions">
                            <button onClick={this.props.closeModal}>Cancel</button>
                            <button onClick={this.saveCampaign} class={ this.state.disabled ? "action-disabled" : "" } disabled={this.state.disabled}>Save</button>
                        </div>
                    </Modal>
                </div>
        )
    }
}