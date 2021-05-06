import React, {Component} from 'react';
import GoogleLogin from './GoogleLogin';
import img from '../img/login_sq_rings.png'
import '../scss/login.scss';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticating: false,
        };
    }

    componentDidMount = () => {
        console.log("Login page mounted");
    }

    render = () => 
        <div className="wrapper">
            {/* <div className="authenticating"></div> */}
            {/* <i className="fa fa-3x fa-spin fa-spinner"></i> */}
            <div className="login-container">
                <div className="login-content">
                    <div className="sc-cloud-convo">
                        <img src={img} alt="" className="login-sq-rings"/>
                        <div className="select-chat-login">Select Chat</div>
                        <GoogleLogin onGoogleLoginSuccess={this.props.onGoogleLoginSuccess} onGoogleLoginFailure={this.props.onGoogleLoginFailure} />
                    </div>
                </div>
            </div>
        </div>
        

        
}