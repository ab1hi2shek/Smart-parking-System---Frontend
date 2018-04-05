import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CSVLink } from 'react-csv';
import './index.css';
import { showMapToPage } from "../actions";

let headers = [
    {label: 'Car Name', key: 'carName'},
    {label: 'Is Parked?', key: 'parked'},
    {label: 'Arrival Time', key: 'arrivalTime'},
    {label: 'Parking Assigned', key: 'parkingAssigned'},
    {label: 'Parked At?', key: 'parkedAt'},
    {label: 'Driving Time(Sec)', key: 'timeOnRoad'},
    {label: 'Driving Distance(Km)', key: 'distanceTravelled'},
    {label: 'Waiting Time(Sec)', key: 'waitingTime'}
];

let shortestHeaders = [
    {label: 'Car Name', key: 'carName'},
    {label: 'Arrival Time', key: 'arrivalTime'},
    {label: 'Parking Assigned', key: 'parkingAssigned'},
    {label: 'Driving Time(Sec)', key: 'timeOnRoad'},
    {label: 'Driving Distance(Km)', key: 'distanceTravelled'},
    {label: 'Waiting Time(Sec)', key: 'waitingTime'}
];

class SimulatorAreaAfter extends Component {

    state = {
        timeToDisplay: "Simulation Time over",
        isStartSimulationButtonClicked: false
    };

    handleSimulationStart = (e) => {
        e.preventDefault();
        this.setState({isStartSimulationButtonClicked: true});
        this.props.showMapToPage();
    };

    render() {
        let carStatusMessageUtil = this.props.carStatusMessage.map(item => {
            return <li className={'carStatusMessage-' + item.color}>{item.message}</li>
        });

        let shortestCarStatusMessage = this.props.shortestCarStatusMessage.map(item => {
            return <li className={'carStatusMessage-' + item.color}>{item.message}</li>
        });

        return (
            <div>
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
                        {!this.props.simulation && this.state.isStartSimulationButtonClicked &&
                            <div>
                                <CSVLink
                                    data={this.props.carParkingData}
                                    headers={headers}
                                    filename={"optimal-algo-parking-data.csv"}
                                    className="btn btn-success mr-sm-2"
                                    target="_blank"
                                >
                                    Download Data 1
                                </CSVLink>
                                <CSVLink
                                    data={this.props.shortestParkingData}
                                    headers={shortestHeaders}
                                    filename={"shortest-dist-parking-data.csv"}
                                    className="btn btn-success mr-sm-2"
                                    target="_blank"
                                >
                                    Download Data 2
                                </CSVLink>
                            </div>
                        }
                    </div>
                    <div className="col-md-4">
                        <div className="message-red"> {this.state.timeToDisplay} </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 offset-1">
                        <h6> Parking based-on optimal algorithm </h6>
                        <div className="row parking-message-container">
                            {carStatusMessageUtil}
                        </div>
                    </div>

                    <div className="col-md-10 offset-1">
                        <h6> Parking based-on shortest distance algorithm </h6>
                        <div className="row parking-message-container">
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
        showMapToPage: function (params) {
            dispatch(showMapToPage(params))
        }

    }
}

function mapStateToProps(state){
    return {
        message: state.message === undefined ? null : state.message,
        simulation: state.simulation === undefined ? false : state.simulation,
        carStatusMessage: state.carStatusMessage === undefined ? [] : state.carStatusMessage,
        shortestCarStatusMessage: state.shortestCarStatusMessage === undefined ? [] : state.shortestCarStatusMessage,
        carParkingData: state.carParkingData === undefined ? [] : state.carParkingData,
        shortestParkingData: state.shortestParkingData === undefined ? [] : state.shortestParkingData
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorAreaAfter);