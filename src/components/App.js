import React, { Component } from 'react';
import {connect} from 'react-redux';

import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import ParkingsList from './ParkingsList';

import {handleLogout} from '../actions/index';

class App extends Component {

	state = {
		signup: true
	}

	handlelogin = () => {
		this.setState({
			signup: !this.state.signup
		})
	}

	handlelogout = () => {
		this.setState({
			signup: true
		})
		this.props.logoutUser();
	}

  	render() {
    	return (
      		<div>
      			<nav className="navbar navbar-dark bg-light justify-content-between">
		  			<a className="navbar-brand">EasyPark - A Smart-Parking Application</a>
		  			{this.props.login ?

		  				<button 
				  			className="btn btn-info mr-sm-2"
				  			onClick = {this.handlelogout}
				  		> 
			  				logout 
			  			</button>

		  				:

			  			<div align="right">
				  			
				  			<button 
				  				className="btn btn-info mr-sm-2"
				  				disabled = {!this.state.signup}
				  				onClick = {this.handlelogin}
				  			> 
			  					login 
			  				</button>
			  			
			  				<button 
			  					className="btn btn-info mr-sm-2"
			  					disabled = {this.state.signup}
			  					onClick = {this.handlelogin}
			  				> 
			  					signup 
			  				</button>

			  			</div>
			  		}

		  			<div> Welcome {this.props.name} </div>
				</nav>
				
				<br />
				<br />

				{this.props.login && <ParkingsList/>}
				{!this.props.login && this.state.signup && <SignupPage/>}
				{!this.props.login && !this.state.signup && <LoginPage/>}

      		</div>
    	);
  	}
}

function mapStateToProps(state){
	return {
		login: state.login === undefined ? false : state.login,
		name: state.name === undefined ? "Guest" : state.name
	}
}

function mapDispatchToProps(dispatch){

	return{
		logoutUser: function(params) {
            dispatch(handleLogout(params));
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
