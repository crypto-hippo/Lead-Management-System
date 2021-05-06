/* eslint-disable no-undef */
import React, {Component} from 'react';

export default class GoogleLogout extends Component {

    constructor(props) {
        super(props);
    }

    render = () =>
        <button className="google-logout-btn" onClick={this.props.onGoogleLogout}>logout</button>
}