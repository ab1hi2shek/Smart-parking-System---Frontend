import React, { Component } from 'react';
import {connect} from 'react-redux';
// import {handleLogin} from '../actions/index';
import { handleFetchParkings } from '../actions/index';
import ParkingsMap from './ParkingsMap';
// import axios from 'axios';

class ParkingList extends Component {

	componentDidMount(){
		this.props.fetchParkings();
	}

  	render() {

  		let parkingData = this.props.parkings.map(({name, _id, free_parking_space}) => {
  			return <p key={_id}>{name} - {free_parking_space}</p>
  		})
    	return (
    		<div className="row">
          <div className="col-md-6">
      			<ParkingsMap 
              markers = {this.props.parkings}
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.
                            exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `550px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
    		</div>
    	);
  	}
}

function mapDispatchToProps(dispatch){

	return{
		fetchParkings: function(params) {
            dispatch(handleFetchParkings(params));
        }
	}
}

function mapStateToProps(state){
	return {
		parkings: state.parkings === undefined ? [] : state.parkings
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ParkingList);