import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleSignUp,  handleLoadingBar } from '../actions/index';
import './index.css';

class SignupPage extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        message: ""
    };

    handleName = (e) => {
        this.setState({
            name: e.target.value
        })
    };

    handleEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    };

    handlePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    };

    handlePasswordConfirm = (e) => {
        this.setState({
            confirmPassword: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.name === ""){
            this.setState({
                message: "Please enter your name"
            })
        }
        else if(this.state.email === ""){
            this.setState({
                message: "Please enter your email address"
            });
        }
        else if(this.state.password.length < 6){
            this.setState({
                message: "Please choose a password of length of at least 6"
            });
        }
        else if(this.state.password !== this.state.confirmPassword){
            this.setState({
                message: "password mismatch - please enter again"
            });
        }
        else
        {
            this.props.handleLoadingBar();
            this.forceUpdate();

            this.props.handleSignUp({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            });
            this.setState({
                password: "",
                confirmPassword: ""
            })

        }
    };

    render() {
        return <div className="row">
            <div className="col-md-4 offset-md-4">
                <h2> Registration Page </h2>
                <br/>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            autoFocus
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your full name"
                            onChange={this.handleName}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            onChange={this.handleEmail}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePassword}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password-confirm">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password-confirm"
                            placeholder="Retype Password"
                            value={this.state.confirmPassword}
                            onChange={this.handlePasswordConfirm}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>

            <div className="col-md-4">
                {!this.props.message &&
                <div className="message-red"> {this.state.message} </div>
                }
                <div className="message-red"> {this.props.message} </div>
            </div>

        </div>;
    }
}

function mapDispatchToProps(dispatch){
    return{
        handleSignUp: function(params) {
            dispatch(handleSignUp(params));
        },
        handleLoadingBar: function(params) {
            dispatch(handleLoadingBar(params));
        }
    }
}

function mapStateToProps(state){
    return {
        message: state.message === undefined ? null : state.message
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);