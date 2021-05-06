/* eslint-disable no-undef */
import React, {Component} from 'react';

require('dotenv').config();

export default class GoogleLogin extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount = () => {
        gapi.load('auth2', () => {
            let client_id = `${process.env.REACT_APP_PROD_G_CLIENT_ID}`;
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            window.auth2 = gapi.auth2.init({
                client_id: client_id,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email',
            });

            var googleLoginBtn = document.getElementById("google-login-btn");
            auth2.attachClickHandler(googleLoginBtn, {}, this.props.onGoogleLoginSuccess, this.props.onGoogleLoginFailure)
        });
    }

    render = () =>
        <button id="google-login-btn" className="login-btn">Log In</button>
}