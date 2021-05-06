import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import img from '../img/header_sq_rings.png'
import '../scss/header.scss';
import  GoogleLogout  from './GoogleLogout';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render = () => 
        <header className="header">
            <img className="sq-rings" src={img} />
            <a href="/" className="select-chat-header">Select Chat</a>

            { this.props.user && 
                <div className="user-nav">
                    <Menu attached='top'>
                        <Dropdown item icon='big globe' simple>
                            <Dropdown.Menu className="">
                                <Dropdown.Item>
                                    <span className='text'>Life</span>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <span className="text">Auto / Home</span>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <span className="text">Senior</span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown item icon='big user circle' simple>
                            <Dropdown.Menu className="user-nav-menu">
                                <Dropdown.Item>
                                    <img src={this.props.user.image_url} alt=""/>
                                    <span className='text'>{ this.props.user.first_name}</span>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <GoogleLogout onGoogleLogout={this.props.onGoogleLogout}/>
                                    {/* <GoogleLogout
                                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                                        buttonText="Logout"
                                        onLogoutSuccess={this.props.onGoogleLogout}>
                                    </GoogleLogout> */}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu>
                </div>
            }
            
        </header>
}