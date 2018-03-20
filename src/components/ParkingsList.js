import React, { Component } from 'react';
import {connect} from 'react-redux';
import { fetchParkings, fetchShortestParking, fetchOptimalParking } from '../actions/index';
import ParkingsMap from './ParkingsMap';
import * as Constants from '../consts/otherConstants';

class ParkingList extends Component {

    state = {
        name: null,
        freeParkingSpace: null,
        totalParkingSpace: null 
    }

	componentDidMount(){
		this.props.fetchParkings();
	}

    handleShortestParking = () => {
        this.props.fetchShortestParking({
            location: Constants.MY_LOCATION,
            token: this.props.token,
        });
    }

    handleOptimalAlgorithm = () => {
        this.props.fetchOptimalParking({
            location: Constants.MY_LOCATION,
            token: this.props.token,
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.parkingToShowFromMap !== null &&
             this.props.parkingToShowFromMap !== nextProps.parkingToShowFromMap){
                this.props.parkings.map(item => {
                if(item.longitude === nextProps.parkingToShowFromMap.longitude.toFixed(6) &&
                    item.lattitude === nextProps.parkingToShowFromMap.lattitude.toFixed(6)){
                    console.log("hahaha");
                    this.setState({
                        name: item.name,
                        freeParkingSpace: item.free_parking_space,
                        totalParkingSpace: item.total_parking_space
                    })
                }
                else{
                    console.log("mc bhadwa");
                }
            })
        }
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
                        zoom = { Constants.ZOOM }
                        defaultCenter = { Constants.DEFAULT_CENTER }
                        showMarkerDetails = { this.showMarkerDetails }
                    />

                </div>

                <div className="col-md-6">

                    <div className="row">
                        <button 
                          className="btn btn-success mr-sm-4"
                          onClick = { this.handleShortestParking }
                        > 
                          Shortest Parking 
                        </button>

                        <button 
                          className="btn btn-success mr-sm-4"
                          onClick = { this.handleOptimalAlgorithm }
                        > 
                          Optimal Parking 
                        </button>
                    </div>

                    <div className="row">
                        { this.props.shortestDistParking && 
                            this.props.shortestDistParking.name }
                        { this.props.shortestDist }
                        { this.props.optimalAlgoParking && 
                            this.props.optimalAlgoParking.name }
                        { this.props.optimalAlgoCost }
                    </div>

                    <div className="row">
                        {this.state.name}
                        {this.state.freeParkingSpace}
                        {this.state.totalParkingSpace}
                    </div>

                </div>

    		</div>
    	);
  	}
}

function mapDispatchToProps(dispatch){

	return{
		fetchParkings: function(params) {
            dispatch(fetchParkings(params));
        },

        fetchShortestParking: function(params) {
            dispatch(fetchShortestParking(params));
        },

        fetchOptimalParking: function(params) {
            dispatch(fetchOptimalParking(params));
        }

	}
}

function mapStateToProps(state){
	return {
        parkingToShowFromMap: state.parkingToShowFromMap === undefined ? 
            null : state.parkingToShowFromMap,

		parkings: state.parkings === undefined ? [] : state.parkings,

        shortestDistParking: state.shortest_dist_parking === undefined ?
            null : state.shortest_dist_parking,

        shortestDist: state.shortest_dist === undefined ? null : state.shortest_dist,

        optimalAlgoParking: state.our_algo_parking === undefined ?
            null : state.our_algo_parking,

        optimalAlgoCost: state.our_algo_cost === undefined ?
            null : state.our_algo_cost
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ParkingList);