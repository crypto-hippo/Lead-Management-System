import React, {Component} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Header from './components/Header';
import Login from './components/Login';
import ChatBot from './components/ChatBot'
import Dashboard from './components/Dashboard';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
    Redirect,
  } from 'react-router-dom';

import './scss/app.scss';

require('dotenv').config();

axios.defaults.withCredentials = true;

export default class App extends Component {

    constructor(props) {
        super(props);
        const user = localStorage.getItem("user")
        this.state = {
            user: user !== "undefined" && user ? JSON.parse(user) : null, 
            dashboardRedirect: false, 
            loginRedirect: false};
    }

    getServerData(user) {
        var profile = user.getBasicProfile();
        var id_token = user.getAuthResponse().id_token;

        return {
            givenName: profile.getGivenName(),
            familyName: profile.getFamilyName(),
            imageUrl: profile.getImageUrl(),
            email: profile.getEmail(),
            id_token: id_token,
        }
    }

    onGoogleLoginSuccess = (user) => {
        const serverData = this.getServerData(user);
        axios.post(`/auth/google`, serverData).then(response => {
            if (response.data.error) {
                alert("An error occurred. Please try again later.")
            } else {
                console.log(response);
                if (response.data.stored) {
                    console.log("First time signing in");
                }

                localStorage.setItem("token", response.data.id_token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                this.setState({user: response.data.user, dashboardRedirect: true})
            }
        })
    }

    resetState() {
        this.setState({user: null, dashboardRedirect: false, loginRedirect: false})
    }

    clearSession() {
        localStorage.clear();
        this.resetState();
    }

    onGoogleLoginError = (error) => {
        console.log(error);
    }

    onGoogleLogout = (response) => {
        axios.get(`/auth/google/logout`).then(response => {
            this.clearSession();
            this.setState({loginRedirect: true})
        });
    }

    componentDidMount = () => {
        console.log("App Mounted");
    }

    render = () =>
        <Router>
            { this.state.dashboardRedirect && 
                <Redirect to="/dashboard/users" />
            }

            { this.state.loginRedirect && 
                <Redirect to="/login" />
            }

            <Switch>

                <Route exact path="/dashboard" component={
                    () => {
                        if (this.state.user) {
                            return <Redirect to="/dashboard/users" />
                        } else {
                            return <Redirect to="/login" />
                        }
                    }
                } />

                <Route path="/dashboard" component={
                    () => {
                        if (this.state.user) {
                            return <Dashboard user={this.state.user} onGoogleLogout={this.onGoogleLogout} />   
                        } else {
                            return <Redirect to="/login" />
                        }
                    }
                } />
                
                <Route path="/login" component={
                    () => {
                        if (this.state.user) {
                            return <Redirect to="/dashboard" />
                        } else {
                            return <Login onGoogleLoginSuccess = {this.onGoogleLoginSuccess} onGoogleLoginError = {this.onGoogleLoginError}  />
                        }
                    }
                } />
                
                <Route exact path="/" component={
                    () => {
                        if (this.state.user) {
                            return <Redirect to="/dashboard" />
                        } else {
                            return <Redirect to="/login" />
                        }
                    }
                } />                 
                
            </Switch>
        </Router>

}


