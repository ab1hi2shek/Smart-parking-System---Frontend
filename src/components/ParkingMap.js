/* global google */
import {withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
import {connect} from 'react-redux';

class ParkingMap extends Component {

    render(){

        const image = {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(33, 41)
        };

        let markersList = this.props.markers.map(({_id, lattitude, longitude, name, parkingSpace }) =>
            (<Marker
                    key={_id}
                    position={{
                        lat: parseFloat(lattitude),
                        lng: parseFloat(longitude)
                    }}
                    title={'Name: ' +  name + ' || Parking Space: ' + parkingSpace }
                    icon={image}
                />
            )
        );

        return(
            <GoogleMap
                defaultZoom={ this.props.zoom }
                defaultCenter={ this.props.defaultCenter }
            >
                { this.props.isMarkerShown && markersList }
                { this.props.carLocationShown &&
                <Marker
                    position = {{lat: parseFloat(this.props.currCarPosition.lattitude),
                        lng: parseFloat(this.props.currCarPosition.longitude) }}
                    icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    title = "Car's current location"
                />
                }
            </GoogleMap>
        );
    }
}

function mapStateToProps(state){
    return {
            carLocationShown: state.carLocationShown === undefined ? false : state.carLocationShown,
            currCarPosition:  state.currCarPosition
    }
}

export default connect(mapStateToProps, null)(withScriptjs(withGoogleMap(ParkingMap)));