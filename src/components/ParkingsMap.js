import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
import {connect} from 'react-redux';
import { showCurrentParkingFromMap } from '../actions/index';


class ParkingsMap extends Component {

	handleMarkerClick = (e) => {
		this.props.showCurrentParkingFromMap({
			lattitude: e.latLng.lat(),
			longitude: e.latLng.lng()
		});
	}

	render(){

		let markersList = this.props.markers.map(({_id, lattitude, longitude}) => {
  			return( <Marker
  						key = {_id}
  						onClick = {this.handleMarkerClick}
  						position={{ lat: parseFloat(lattitude), lng: parseFloat(longitude) }}
  				 	/>
  				);
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
