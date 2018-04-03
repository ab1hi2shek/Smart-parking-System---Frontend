import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleLogin, handleLoadingBar } from '../actions/index';
import './index.css';

class ParkingsList extends Component {

    state = {
        email: "",
        password: "",
        message: ""
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

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.email === ""){
            this.setState({
                message: "Please enter your email address to login"
            })
        }
        else if(this.state.password === ""){
            this.setState({
                message: "Plese enter your password to login"
            })
        }
        else
        {
            this.props.handleLoadingBar();
            this.forceUpdate();
            this.props.handleLogin({
                email: this.state.email,
                password: this.state.password
            });
        }
    };

    render() {
        return <div className="row">
            <div className="col-md-4 offset-md-4">
                <h2> Login Page </h2>
                <br/>

                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            autoFocus
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
                <div className="message-red"> {this.state.message} </div>
                <div className="message-red"> {this.props.message} </div>
            </div>
        </div>;
    }
}


function mapDispatchToProps(dispatch){

    return{
        handleLogin: function(params) {
            dispatch(handleLogin(params));
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

export default connect(mapStateToProps, mapDispatchToProps)(ParkingsList);