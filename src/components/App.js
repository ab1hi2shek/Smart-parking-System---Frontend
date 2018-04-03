import React, { Component } from 'react';

class App extends Component {

	state = {
		message: null,
		disable: false,
		other: null
	}

	handleSimulate = (e) => {

		this.setState({
			disable: true
		})

	}

  	render() {
    	return (
      		<div>
      			<button
      				onClick = {this.handleSimulate}
      				disabled = {this.state.disable}
      			>
      			Simulate
      			</button>
      			<hr/>
      			{this.state.message !== null && <div> {this.state.message} </div> }
      			{this.state.other !== null && <div> {this.state.other} </div> }
      		</div>
    	);
  	}
}

export default App;
