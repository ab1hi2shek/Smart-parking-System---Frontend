/* global google */
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import React, { Component } from 'react';
import {connect} from 'react-redux';
import { showCurrentParkingFromMap } from '../actions/index';
// import { CAR_ICON } from '../consts/otherConstants';


class ParkingsMap extends Component {

	state = {
		clickedLat: null,
		clickedLng: null
	}

	handleMarkerClick = (e) => {
		this.setState({
			clickedLat: e.latLng.lat(),
			clickedLng: e.latLng.lng()  
		});

		this.props.showCurrentParkingFromMap({
			lattitude: e.latLng.lat(),
			longitude: e.latLng.lng()
		});
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.resultantLat !== null && (nextProps.resultantLat !==
			this.props.resultantLat || nextProps.resultantLng !== this.props.resultantLng)){
			this.setState({
				clickedLat: nextProps.resultantLat,
				clickedLng: nextProps.resultantLng  
			});

			this.props.showCurrentParkingFromMap({
				lattitude: nextProps.resultantLat,
				longitude: nextProps.resultantLng
			});
		}
	}

	render(){

		var image = {
			url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
			scaledSize: new google.maps.Size(51, 63)
		};

		let markersList = this.props.markers.map(({_id, lattitude, longitude, name,
			total_parking_space, free_parking_space }) => {

			let thisStateClickedLat = this.state.clickedLat;
			let thisStateClickedLng = this.state.clickedLng;

			if(thisStateClickedLat != null && typeof thisStateClickedLat !== 'string'){
            	thisStateClickedLat = thisStateClickedLat.toFixed(6);
            	thisStateClickedLng = thisStateClickedLng.toFixed(6);
        	}

			let condn = this.state.clickedLat && thisStateClickedLat === lattitude && 
				thisStateClickedLng === longitude;

			if(condn){
				return( <Marker
  						key = {_id}
  						position={{ lat: parseFloat(lattitude),
  							 lng: parseFloat(longitude) }}
  						title = { name }
  						icon = {image}
  						onClick = {this.handleMarkerClick}
  				 	/>
  				);	
			}
			else {
	  			return( <Marker
	  						key = {_id}
	  						position={{ lat: parseFloat(lattitude),
	  							 lng: parseFloat(longitude) }}
	  						title = { name }
	  						onClick = {this.handleMarkerClick}
	  				 	/>
	  				);
	  			}
	  		}
  		)

		return(
			<GoogleMap
    			defaultZoom={ this.props.zoom }
    			defaultCenter={ this.props.defaultCenter }
  			>
  			{ this.props.isMarkerShown && markersList }
    		{ this.props.myLocationShown &&
    			<Marker
    				onClick = {this.handleMarkerClick}
    				position = {{lat: parseFloat(this.props.myLattitude), 
    								lng: parseFloat(this.props.myLongitude) }}
    				icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    				title = "Your current location"
    			/>  
    		}
  			</GoogleMap>
		);
	}
}

function mapDispatchToProps(dispatch){

	return{
		showCurrentParkingFromMap: function(params) {
            dispatch(showCurrentParkingFromMap(params));
        }

	}
}

export default connect(null, mapDispatchToProps)(withScriptjs(withGoogleMap(ParkingsMap)));
