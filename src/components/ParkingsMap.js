import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
  

class ParkingsMap extends Component {

	handleClick = (e) => {
		console.log(e.latLng.lat());
		console.log(e.latLng.lng());
	}

	render(){

		let markersList = this.props.markers.map(({_id, lattitude, longitude}) => {
  			return ( <Marker
  						key = {_id} 
  						position={{ lat: parseFloat(lattitude), lng: parseFloat(longitude) }}
  				 />
  			);
  		})

		return(
			<GoogleMap
    			defaultZoom={ 13 }
    			defaultCenter={ { lat: 23.544974, lng: 87.300135 } }
  			>
    		{ this.props.isMarkerShown && markersList }
  			</GoogleMap>
		);
	}
}

export default withScriptjs(withGoogleMap(ParkingsMap));
