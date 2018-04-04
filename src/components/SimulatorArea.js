import React, { Component } from 'react';
import {connect} from 'react-redux';
import ParkingMap from './ParkingMap';
import * as Constants from '../consts/otherConstants';
import './index.css';
import {
    handleFetchParkings, handleAllAboutParkingUtil,
    handleLoadingBar, handleBackgroundAction,
    handleStopSimulation, handleStartSimulation
} from "../actions";

class SimulatorArea extends Component {

    state = {
        timeToDisplay: null
    };

    handleSimulationStop = (e) => {
        e.preventDefault();
        this.props.handleStopSimulation();
    };

    handleSimulationStart = (e) => {
        e.preventDefault();
        this.props.handleStartSimulation();

        const timeToRun = 1000 * Constants.SIMULATION_TIME;
        const timeout = new Date()*1 + timeToRun;
        let currTimeElapsed = 0;

        let secCounterTimerID = setInterval(() => {
            if(new Date() > timeout || !this.props.simulation){
                clearInterval(secCounterTimerID);
                this.setState({ timeToDisplay: 'Simulation time over'});
                this.props.handleStopSimulation();
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
                this.setState({ disable: false})
            }
            else {
                this.props.handleAllAboutParkingUtil({carNumber: carNumber});
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

        return (
            <div className="row">
                <div className="col-md-6 map-container">
                    <ParkingMap
                        markers = {this.props.parkings}
                        isMarkerShown
                        googleMapURL= { Constants.GOOGLE_MAP_URL}
                        async defer
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `580px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        zoom = { Constants.ZOOM }
                        defaultCenter = { Constants.DEFAULT_CENTER }
                    />
                </div>
                <div className="col-md-6">

                    <div className="row">
                        <div className="col-md-6">
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
                        <div className="col-md-6">
                            <div className="message-red"> {this.state.timeToDisplay} </div>
                        </div>
                    </div>

                    <br />

                    <div className="row parking-message-container">
                        <div className="col-md-10 offset-1">
                            {carStatusMessageUtil}
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
        parking2DArray: state.parking2DArray === undefined ? [] : state.parking2DArray
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorArea);