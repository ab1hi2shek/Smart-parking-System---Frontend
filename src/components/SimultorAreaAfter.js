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

        let avgOptimal = this.props.optimalTotalWaitingTime/this.props.carParkingData.length;
        let avgShortest = this.props.shortestTotalWaitingTime/this.props.shortestParkingData.length;
        let percentage = (((avgShortest - avgOptimal) / avgShortest) * 100).toFixed(2);

        return (
            <div>
                <div className="row">
                    <div className="col-md-2 offset-1">
                        {!this.props.simulation && this.props.hideMap &&
                            <CSVLink
                                data={this.props.carParkingData}
                                headers={headers}
                                filename={"optimal-algo-parking-data.csv"}
                                className="btn btn-info mr-sm-2"
                                target="_blank"
                            >
                                Download Parking Data
                            </CSVLink>
                        }
                    </div>

                    <div className="col-md-2 offset-2">
                        {!this.props.simulation &&
                        <button
                            className="btn btn-danger mr-sm-2"
                            disabled={this.state.simulation}
                            onClick={this.handleSimulationStart}
                        >
                            Start Simulation
                        </button>
                        }
                    </div>

                    <div className="col-md-2 offset-2">
                        {!this.props.simulation && this.props.hideMap &&
                            <CSVLink
                                data={this.props.shortestParkingData}
                                headers={shortestHeaders}
                                filename={"shortest-dist-parking-data.csv"}
                                className="btn btn-info mr-sm-2"
                                target="_blank"
                            >
                                Download Parking Data
                            </CSVLink>
                        }
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-5 offset-1">
                        <h4> Parking based-on optimal algorithm </h4>
                        <div className="full-message-container">
                            {carStatusMessageUtil}
                        </div>
                        <hr />
                        <h6><strong>Average waiting time: {avgOptimal.toFixed(2)} secs</strong>s</h6>
                        <h6><strong>Percentage decrease: {percentage} %</strong></h6>
                    </div>

                    <div className="col-md-5">
                        <h4> Parking based-on shortest distance algorithm </h4>
                        <div className="full-message-container">
                            {shortestCarStatusMessage}
                        </div>
                        <hr />
                        <h6><strong>Average waiting time: {avgShortest.toFixed(2)} secs</strong></h6>
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
        shortestParkingData: state.shortestParkingData === undefined ? [] : state.shortestParkingData,
        hideMap: state.hideMap === undefined ? false : state.hideMap,
        shortestTotalWaitingTime: state.shortestTotalWaitingTime,
        optimalTotalWaitingTime: state.optimalTotalWaitingTime
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorAreaAfter);