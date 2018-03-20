import React, { Component } from 'react';
import {connect} from 'react-redux';
import { fetchParkings, fetchShortestParking, fetchOptimalParking } from '../actions/index';
import ParkingsMap from './ParkingsMap';
import * as Constants from '../consts/otherConstants';

class ParkingList extends Component {

    state = {
        name: null,
        freeParkingSpace: null,
        totalParkingSpace: null,
        shortestAlgoButtonClick: false,
        optimalAlgoButtonClick: false 
    }

	componentDidMount(){
		this.props.fetchParkings();
	}

    handleShortestParking = () => {
        this.setState({
            shortestAlgoButtonClick: true,
            optimalAlgoButtonClick: false
        })
        this.props.fetchShortestParking({
            location: Constants.MY_LOCATION,
            token: this.props.token,
        });
    }

    handleOptimalAlgorithm = () => {
        this.setState({
            optimalAlgoButtonClick: true,
            shortestAlgoButtonClick: false
        })
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
                        googleMapURL="https://maps.googleapis.com/maps/api/js?
                            key=AIzaSyAuqEdlOBNzTgc9QeILQCefKqTljgvQnbw
                            &v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `550px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        zoom = { Constants.ZOOM }
                        defaultCenter = { Constants.DEFAULT_CENTER }
                        showMarkerDetails = { this.showMarkerDetails }
                    />

                </div>

                <div className="col-md-5">

                    <div className="row">
                        <button 
                          className="btn btn-success mr-sm-4"
                          onClick = { this.handleShortestParking }
                          disabled = { this.state.shortestAlgoButtonClick }
                        > 
                          Shortest Parking 
                        </button>

                        <button 
                          className="btn btn-success mr-sm-4"
                          onClick = { this.handleOptimalAlgorithm }
                          disabled = { this.state.optimalAlgoButtonClick }
                        > 
                          Optimal Parking 
                        </button>
                        <br/>
                        <hr />
                    </div>

                    <div className="row">
                        { this.props.shortestDistParking &&
                            <div>
                                <br/>
                                <br/>
                                <div class="alert alert-info" role="alert">
                                    The shortest distance parking from your location is 
                                    &nbsp;<strong>{this.props.shortestDistParking.name}
                                    </strong> with distance of 
                                    &nbsp;<strong>{ this.props.shortestDist.toFixed(3) }
                                    Km</strong>.
                                </div>
                            </div>
                        }

                        { this.props.optimalAlgoParking &&
                            <div>
                                <br/>
                                <br/>
                                <div class="alert alert-info" role="alert">
                                    The optimal parking from your location based on distance
                                    as well as number of free parking slots is
                                    &nbsp;<strong>{this.props.optimalAlgoParking.name}
                                    </strong> with the cost of 
                                    &nbsp;<strong>{ this.props.optimalAlgoCost.toFixed(4)}
                                    </strong>.
                                </div>
                            </div>
                        }
                    </div>

                    {this.state.name &&
                        <div>
                            <br/>
                            <br/>
                            <div className="row">
                                <div class="alert alert-success" role="alert">
                                    <h4 class="alert-heading">{this.state.name}</h4>
                                    <hr/>
                                    <p class="mb-0">
                                        <strong>Free Paking Space</strong>&nbsp;-&nbsp; 
                                        {this.state.freeParkingSpace}
                                    </p>
                                    <p class="mb-0">
                                        <strong>Total Parking Space</strong>&nbsp;-&nbsp; 
                                        {this.state.totalParkingSpace}
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    
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