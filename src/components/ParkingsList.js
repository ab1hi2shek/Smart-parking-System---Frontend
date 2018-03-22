import React, { Component } from 'react';
import {connect} from 'react-redux';
import { fetchParkings, fetchShortestParking, fetchOptimalParking, 
    showLoadingBar, bookParkingSlot, resetToDefault } from '../actions/index';
import ParkingsMap from './ParkingsMap';
import * as Constants from '../consts/otherConstants';
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import './index.css';

class ParkingList extends Component {

    state = {
        name: null,
        freeParkingSpace: null,
        totalParkingSpace: null,
        resultantLng: null,
        resultantLat: null,
        isBooked: false
    }

	componentDidMount(){
        this.props.showLoadingBar();
        this.forceUpdate();
		this.props.fetchParkings();
	}

    handleShortestParking = () => {
        this.props.showLoadingBar();
        this.forceUpdate();
        
        this.props.fetchShortestParking({
            location: Constants.MY_LOCATION,
            token: this.props.token,
        });
    }

    handleOptimalAlgorithm = () => {
        this.props.showLoadingBar();
        this.forceUpdate();
        
        this.props.fetchOptimalParking({
            location: Constants.MY_LOCATION,
            token: this.props.token,
        });
    }

    handleBookParking = () => {
        this.setState({isBooked: true})
        this.props.showLoadingBar();
        this.forceUpdate();
        this.props.bookParkingSlot({
            parkingToUpdate: this.props.optimalAlgoParking
        });
        
        this.setState({
            name: "",
            freeParkingSpace: "",
            totalParkingSpace: ""
        })
    }

    resetToDefault = () => {
        this.props.showLoadingBar();
        this.forceUpdate();
        this.props.resetToDefault();

        this.setState({
            name: "",
            freeParkingSpace: "",
            totalParkingSpace: ""
        })
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.parkings !== this.props.parkings)
            this.forceUpdate();

        let currParking = nextProps.parkingToShowFromMap;
        let currLong = currParking ? currParking.longitude : null;
        let currLat = currParking ? currParking.lattitude : null;

        let condition = nextProps.parkingToShowFromMap !== null &&
             this.props.parkingToShowFromMap !== nextProps.parkingToShowFromMap;

        let myLat = Constants.MY_LOCATION.lattitude;
        let myLong = Constants.MY_LOCATION.longitude;

        if(currLong != null && typeof currLong !== 'string'){
            currLong = currLong.toFixed(6);
            currLat = currLat.toFixed(6);
        }

        if(condition){
                this.props.parkings.map(item => {
                if(item.longitude === currLong &&
                    item.lattitude === currLat){
                    this.setState({
                        name: item.name,
                        freeParkingSpace: item.free_parking_space,
                        totalParkingSpace: item.total_parking_space
                    })
                }
                else if(myLong === currLong &&
                    myLat === currLat){
                    this.setState({
                        name: "Your current location",
                        freeParkingSpace: null,
                        totalParkingSpace: null
                    })
                }
            })
        }

        let srtPrk = nextProps.shortestDistParking
        let conditionButtonClicked1 = srtPrk !== null && (srtPrk.lattitude !==
             this.state.resultantLat || srtPrk.longitude !== this.setState.resultantLng)

        if (conditionButtonClicked1){
            this.setState({
                resultantLng: srtPrk.longitude,
                resultantLat: srtPrk.lattitude
            })
        }

        let optPrk = nextProps.optimalAlgoParking
        let conditionButtonClicked2 = optPrk !== null && (optPrk.lattitude !==
             this.state.resultantLat || optPrk.longitude !== this.setState.resultantLng)

        if (conditionButtonClicked2){
            this.setState({
                resultantLng: optPrk.longitude,
                resultantLat: optPrk.lattitude
            })
        }
    }

  	render() {

  		let parkingData = this.props.parkings.map(({name, _id, free_parking_space}) => {
  			return <p key={_id}>{name} - {free_parking_space}</p>
  		})
    	return (
    		<div className="row">
                <Loading
                    show={this.props.isLoading}
                    color="red"
                />

                <div className="col-md-6">

          			<ParkingsMap 
                        markers = {this.props.parkings}
                        isMarkerShown
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDxP2D4qnJZnsfwCFu9vjhw9vf6qWBRc5k&callback=initMap"
    async defer
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `550px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        zoom = { Constants.ZOOM }
                        defaultCenter = { Constants.DEFAULT_CENTER }
                        showMarkerDetails = { this.showMarkerDetails }
                        myLocationShown
                        myLattitude = { Constants.MY_LOCATION.lattitude }
                        myLongitude = { Constants.MY_LOCATION.longitude }
                        resultantLat = { this.state.resultantLat }
                        resultantLng = { this.state.resultantLng }
                    />

                </div>

                <div className="col-md-5">

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

                        {this.props.optimalAlgoParking && 
                            <button 
                                className="btn btn-info mr-sm-4"
                                onClick = { this.handleBookParking }
                            > 
                                Book 
                            </button>
                        }

                        {this.state.isBooked && 
                            <button 
                                className="btn btn-info mr-sm-4"
                                onClick = { this.resetToDefault }
                            > 
                                Reset to default 
                            </button>
                        }

                        {!this.props.status && 
                            <div className="message-red">{this.props.message}</div>
                        }
                        <br/>
                        <hr />
                    </div>

                    <div className="row">
                        { this.props.shortestDistParking &&
                            <div>
                                <br/>
                                <br/>
                                <div className="alert alert-info" role="alert">
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
                                <div className="alert alert-info" role="alert">
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
                                <div className="alert alert-success" role="alert">
                                    <h4 className="alert-heading">{this.state.name}</h4>
                                    
                                    { this.state.freeParkingSpace &&
                                        <div>
                                            <hr/> 
                                            <p className="mb-0">
                                                <strong>Free Paking Space</strong>&nbsp;-&nbsp; 
                                                {this.state.freeParkingSpace}
                                            </p>
                                        </div>
                                    }
                                    { this.state.totalParkingSpace &&
                                        <p className="mb-0">
                                            <strong>Total Parking Space</strong>&nbsp;-&nbsp; 
                                            {this.state.totalParkingSpace}
                                        </p>
                                    }
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
        },

        showLoadingBar: function(params) {
            dispatch(showLoadingBar(params));
        },

        bookParkingSlot: function(params) {
            dispatch(bookParkingSlot(params));
        },

        resetToDefault: function(params) {
            dispatch(resetToDefault(params));
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
            null : state.our_algo_cost,

        isLoading: state.isLoading === undefined ? false : state.isLoading,

        status: state.status === undefined ? 1 : state.status,

        message: state.message === undefined ? null : state.message
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ParkingList);