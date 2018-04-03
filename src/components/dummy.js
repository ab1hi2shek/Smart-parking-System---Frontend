import React, { Component } from 'react';
import {connect} from 'react-redux';
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'

import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import SimulatorArea from './SimulatorArea';
import {handleLogout} from '../actions/index';

class Dummy extends Component {

    state = {
        signUp: false
    };

    handleLogin = () => {
        this.setState({
            signUp: !this.state.signUp
        });
    };

    handleLogout = () => {
        this.setState({
            signUp: true
        });
        this.props.handleLogout();
    };

    render() {
        return <div>
            <nav className="navbar navbar-dark bg-light justify-content-between">
                <a className="navbar-brand">SimulatorPark - A Smart-Parking Simulator Application</a>
                {this.props.login ?

                    <button
                        className="btn btn-info mr-sm-2"
                        onClick={this.handleLogout}
                        disabled = {this.props.simulation}
                    >
                        logOut
                    </button>

                    :

                    <div align="right">

                        <button
                            className="btn btn-info mr-sm-2"
                            disabled={this.state.signUp}
                            onClick={this.handleLogin}
                        >
                            login
                        </button>

                        <button
                            className="btn btn-info mr-sm-2"
                            disabled={!this.state.signUp}
                            onClick={this.handleLogin}
                        >
                            signUp
                        </button>

                    </div>
                }

                <div> Welcome {this.props.name} </div>
            </nav>
            <Loading
                show={this.props.isLoading}
                color="red"
            />

            <br/>
            <br/>

            {this.props.login && <SimulatorArea/>}
            {!this.props.login && !this.state.signUp && <SignUpPage/>}
            {!this.props.login && this.state.signUp && <LoginPage/>}
        </div>;
    }
}

function mapStateToProps(state){
    return {
        isLoading: state.isLoading === undefined ? false : state.isLoading,
        login: state.login === undefined ? false : state.login,
        name: state.name === undefined ? "Guest" : state.name,
        simulation: state.simulation === undefined ? false : state.simulation
    }
}

function mapDispatchToProps(dispatch){
    return{
        handleLogout: function(params) {
            dispatch(handleLogout(params));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dummy);