import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleLogin, showLoadingBar } from '../actions/index';
import './index.css';
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'

class ParkingsList extends Component {

	state = {
		email: "",
		password: "",
		message: ""
	}

	handleEmail = (e) => {
		this.setState({
			email: e.target.value
		})
	}

	handlePassword = (e) => {
		this.setState({
			password: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		
		if(this.state.email === ""){
			this.setState({
				message: "Plese enter your email address to login"
			})
		}

		else if(this.state.password === ""){
			this.setState({
				message: "Plese enter your password to login"
			})
		}

		else
		{
			this.props.showLoadingBar();
			this.forceUpdate();
			this.props.loginUser({
				email: this.state.email,
				password: this.state.password
			});
		}
	}

  	render() {
    	return (
    	
	    	<div>
	    		<Loading
          			show={this.props.isLoading}
          			color="red"
        		/>
	    		<div className="row">
	    			<div className="col-md-4 offset-md-4">
	    				<h2> Login Page  </h2>
	    				<div className="display-message"> {this.state.message} </div>
	    				
	    				<br />
	    				
	    				<form>
	    					
	  						<div className="form-group">
		    					<label htmlFor="email">Email address</label>
				    			<input 
				    				autoFocus
				    				type="email" 
				    				className="form-control" 
				    				id="email"
				    			 	placeholder="Enter email"
				    			 	onChange = {this.handleEmail}
				    			/>
	  						</div>

				  			<div className="form-group">
					    		<label htmlFor="password">Password</label>
					    		<input 
					    			type="password"
					    			className="form-control"
					    			id="password"
					    			placeholder="Password"
					    			onChange = {this.handlePassword}
					    		/>
				  			</div>

	  						<button 
	  							type="submit"
	  							className="btn btn-primary"
	  							onClick = {this.handleSubmit}
	  						>
	  							Submit
	  						</button>

						</form>
					</div>
				</div>
			</div>
    	);
  	}
}


function mapDispatchToProps(dispatch){

	return{
		loginUser: function(params) {
            dispatch(handleLogin(params));
        },

		showLoadingBar: function(params) {
            dispatch(showLoadingBar(params));
        }
	}
}

function mapStateToProps(state){
	return {
		isLoading: state.isLoading === undefined ? false : state.isLoading
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ParkingsList);