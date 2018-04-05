import React, { Component } from 'react';
import {connect} from 'react-redux';

import ParkingMap from './ParkingMap';
import * as Constants from '../consts/otherConstants';
import './index.css';
import {
    handleFetchParkings, handleAllAboutParkingUtil,
    handleLoadingBar, handleBackgroundAction,
    handleStopSimulation, handleStartSimulation,
    handleHideMapFromPage
} from "../actions";

class SimulatorArea extends Component {

    state = {
        timeToDisplay: null,
        isStartSimulationButtonClicked: false
    };

    handleSimulationStop = (e) => {
        e.preventDefault();
        this.props.handleStopSimulation();
        this.props.handleHideMapFromPage();
    };

    handleSimulationStart = (e) => {
        e.preventDefault();
        this.setState({isStartSimulationButtonClicked: true});
        this.props.handleStartSimulation();

        const timeToRun = 1000 * Constants.SIMULATION_TIME;
        const timeout = new Date()*1 + timeToRun;
        let currTimeElapsed = 0;

        let secCounterTimerID = setInterval(() => {
            if(new Date() > timeout || !this.props.simulation){
                clearInterval(secCounterTimerID);
                this.setState({ timeToDisplay: ' wait ...'});
            }
            else {
                currTimeElapsed = currTimeElapsed + 1;
                let currTimeRemaining = Constants.SIMULATION_TIME - currTimeElapsed;
                this.setState({ timeToDisplay: currTimeRemaining + ' seconds remaining'});
                this.props.handleBackgroundAction();
            }

        }, 1000);

        let carNumber = 1;
        let carArrivalTimerID = setInterval(() => {
            if (new Date() > timeout || !this.props.simulation) {
                clearInterval(carArrivalTimerID);
                setTimeout(() => {
                    this.setState({ disable: false});
                    this.setState({ timeToDisplay: 'Simulation time over'});
                    this.props.handleStopSimulation();
                    this.props.handleHideMapFromPage();
                }, 12000);
            }
            else {
                this.props.handleAllAboutParkingUtil({
                    carNumber: carNumber,
                    arrivalTime: new Date().toLocaleString()
                });
                carNumber++;
            }

        }, 5000)
    };

    componentDidMount(){
        this.props.handleFetchParkings();
    }

    render() {
        let carStatusMessageUtil = this.props.carStatusMessage.map(item => {
            return <li className={'carStatusMessage-' + item.color}>{item.message}</li>
        });

        let shortestCarStatusMessage = this.props.shortestCarStatusMessage.map(item => {
            return <li className={'carStatusMessage-' + item.color}>{item.message}</li>
        });

        return (

            <div className="row">
                <div className="col-md-6 map-container">
                    <ParkingMap
                        markers = {this.props.parkings}
                        isMarkerShown
                        googleMapURL= { Constants.GOOGLE_MAP_URL}
                        async defer
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `530px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        zoom = { Constants.ZOOM }
                        defaultCenter = { Constants.DEFAULT_CENTER }
                    />
                </div>
                <div className="col-md-6">

                    <div className="row">
                        <div className="col-md-8">
                            {!this.props.simulation &&
                            <button
                                className="btn btn-success mr-sm-2"
                                disabled={this.state.simulation}
                                onClick={this.handleSimulationStart}
                            >
                                Start Simulation
                            </button>
                            }
                            {this.props.simulation &&
                            <button
                                className="btn btn-success mr-sm-2"
                                disabled={this.state.simulation}
                                onClick={this.handleSimulationStop}
                            >
                                Stop Simulation
                            </button>
                            }
                        </div>
                        <div className="col-md-4">
                            <div className="message-red"> {this.state.timeToDisplay} </div>
                        </div>
                    </div>

                    <br />
                    <h6> Parking based-on optimal algorithm </h6>
                    <div className="row parking-message-container">
                        <div className="col-md-10 offset-1">
                            {carStatusMessageUtil}
                        </div>
                    </div>

                    <br />
                    <h6> Parking based-on shortest distance algorithm </h6>
                    <div className="row parking-message-container">
                        <div className="col-md-10 offset-1">
                            {shortestCarStatusMessage}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return{
        handleFetchParkings: function(params) {
            dispatch(handleFetchParkings(params));
        },
        handleLoadingBar: function(params) {
            dispatch(handleLoadingBar(params));
        },
        handleBackgroundAction: function (params) {
            dispatch(handleBackgroundAction(params))
        },
        handleStopSimulation: function (params) {
            dispatch(handleStopSimulation(params))
        },
        handleStartSimulation: function (params) {
            dispatch(handleStartSimulation(params))
        },
        handleAllAboutParkingUtil: function (params) {
            dispatch(handleAllAboutParkingUtil(params))
        },
        handleHideMapFromPage: function (params) {
            dispatch(handleHideMapFromPage(params))
        }
    }
}

function mapStateToProps(state){
    return {
        parkingToShowFromMap: state.parkingToShowFromMap === undefined ? null : state.parkingToShowFromMap,
        parkings: state.parkings === undefined ? [] : state.parkings,
        message: state.message === undefined ? null : state.message,
        simulation: state.simulation === undefined ? false : state.simulation,
        carStatusMessage: state.carStatusMessage === undefined ? [] : state.carStatusMessage,
        shortestCarStatusMessage: state.shortestCarStatusMessage === undefined ? [] : state.shortestCarStatusMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorArea);