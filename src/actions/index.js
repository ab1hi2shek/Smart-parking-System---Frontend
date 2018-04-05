/**
 * created by ABHISHEK KUMAR
 * Date: 01 Apr 2018
 */
import * as ActionTypes from '../consts/actionTypes';
import axios from 'axios';
import {URL, DEFAULT_CENTER, RADIUS, MAX_DISTANCE, MAX_PARKING_SPACE, PARKING_TIME} from '../consts/otherConstants';
import { defaultParking } from '../consts/parkings';

/**
 * Action creator to handle login. It calls a node api to check if user is authenticated or not.
 * @param params
 * @returns {Function}
 */
export function handleLogin(params){
    /**
     * this is a loophole for testing purpose. If no net connection, we can skip api call using admin credentials.
     */
    if(params.email === 'admin@admin.com' && params.password === 'admin'){
        let dummyValue = {
            name: 'admin',
            email: 'admin@admin.com'
        };
        return{
            type: ActionTypes.LOG_IN_USER_SUCCESS,
            payload: dummyValue,
            meta: params
        }
    }
    /**
     * API call using redux-thunk and axios
     */
    return function(dispatch){
        let data = {
            email: params.email,
            password: params.password
        };
        axios.post(URL + 'user/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.LOG_IN_USER_SUCCESS,
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.LOG_IN_USER_FAILURE,
            payload: err.response,
            meta: params
        }))
    }
}

/**
 * Action creator to sign up a user. This also calls a node API to save user credentials in database.
 * @param params
 * @returns {Function}
 */
export function handleSignUp(params){
    return function(dispatch){
        let data = {
            name: params.name,
            email: params.email,
            password: params.password
        };
        axios.post(URL + 'user/signup', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.SIGN_UP_USER_SUCCESS,
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.SIGN_UP_USER_FAILURE,
            payload: err.response,
            meta: params
        }))
    }
}

/**
 * Action creator to log out user. Note that we are not using sessions, we just change the page in logout.
 * @param params
 * @returns {{type: string, payload: null, meta: *}}
 */
export function handleLogout(params){
    return {
        type: ActionTypes.LOG_OUT_USER,
        payload: null,
        meta: params
    }
}

/**
 * Action creator to load default parking saved in constant to the store and renders map.
 * @param params
 * @returns {{type: string, payload: {defaultParking, parking2DArray: parkingDS, simulation: boolean}, meta: *}}
 */
export function handleFetchParkings(params){
    /**
     * to create the parking 2D array to store parking is booked or not.
     * @type {parkingDS}
     */
    let parking2DArray = createParkingDS(defaultParking);
    let shortestParking2DArray = createParkingDS(defaultParking);
    /**
     * return the type, payload and meta data.
     */
    return {
        type: ActionTypes.FETCH_PARKINGS,
        payload: {
            defaultParking: defaultParking,
            parking2DArray: parking2DArray,
            shortestParking2DArray: shortestParking2DArray,
            simulation: false
        },
        meta: params
    }
}

// *********** Below set of functions is to handle All about parking using timer **************************
/**
 * Util action creator of handleAllAboutParking to get curr state inside action creator
 * @param params
 * @returns {Function}
 */
export function handleAllAboutParkingUtil(params){
    return (dispatch, getState) => {
        let currParking2DArray = getState().parking2DArray;
        let currShortestParking2DArray = getState().shortestParking2DArray;
        dispatch(handleAllAboutParking({
            arrivalTime: params.arrivalTime,
            currParking2DArray: currParking2DArray,
            currShortestParking2DArray: currShortestParking2DArray,
            carNumber: params.carNumber
        }));
    }
}
/**
 * Action creator to handle all actions and timeout for a car to show, find optimal parking and get booking
 * @param params
 * @returns {Function}
 */
export function handleAllAboutParking(params){
    //to generate random longitude and lattitude
    let currCarPosition = generateRandomPosition();
    //to find the optimal parking place for the current car as well as shortest parking
    let parkingDetails = findOptimalParking({
        currCarPosition: currCarPosition,
        currParking2DArray: params.currParking2DArray
    });
    //to dispatch actions, basically this an action that dispatches several actions
    return function (dispatch) {
        //to dispatch an action which will show the current car position on map
        dispatch(handleShowCurrentCarToMap({
            currCarPosition: currCarPosition,
            carNumber: params.carNumber
        }));
        /**
         * to dispatch an action to show message that which car has been parked where on basis of optimal parking
         */
        dispatch(handleParkingAssignedMessage({
            message: "Car " + params.carNumber + " is assigned to parking " + parkingDetails.parkingPlace.name + ".",
            color: 'black'
        }));
        /**
         * to dispatch an action to show message that which car has been parked where on basis of shortest parking
         */
        let assignedShortPark = parkingDetails.shortestParkingPlace;
        dispatch(handleShortestParkingMessage({
            message: "Car " + params.carNumber + " is assigned to parking " + assignedShortPark.name + ".",
            color: 'black'
        }));
        /**
         * to find the position where car can be accommodated in future on basis of shortest parking
         * @type {number}
         */
        let minValue = 999999999;
        let minIndex = 0;
        let currShortestParking2DArray = params.currShortestParking2DArray;
        for(let i=0; i<currShortestParking2DArray[assignedShortPark.index].length; i++){
            let currValue = currShortestParking2DArray[assignedShortPark.index][i];
            if(currValue < minValue){
                minValue = currValue;
                minIndex = i;
            }
        }
        /**
         * dispatching action for shortest distance to book
         */
        let shortDistTravelled = parkingDetails.shortestParkingDistance;
        let shortTimeOnRoad = (shortDistTravelled * 2).toFixed(2);
        let temp = minValue - Math.floor(shortDistTravelled * 2) > 0 ? minValue - Math.floor(shortDistTravelled * 2) : 0;
        let total_time = temp + PARKING_TIME;
        let waitingTime = (shortDistTravelled * 2 + temp).toFixed(2);
        dispatch(handleBookParking({
            rowNumber: assignedShortPark.index,
            columnNumber: minIndex,
            data: total_time,
            meta: "shortest"
        }));
        /**
         * to dispatch action to display message for shortest distance
         */
        dispatch(handleShortestParkingMessage({
            message: "Car " + params.carNumber + " will be parked at " + assignedShortPark.name +
                " after " + waitingTime + ' secs.',
            color: shortDistTravelled * 2 + temp >  90 ? 'red' : 'green'
        }));
        /**
         * save data to generate csv file
         */
        dispatch(handleSaveShortestData({
            carName: "Car " + params.carNumber,
            arrivalTime: params.arrivalTime,
            parkingAssigned: assignedShortPark.name,
            timeOnRoad: shortTimeOnRoad,
            distanceTravelled: shortDistTravelled.toFixed(2),
            waitingTime: waitingTime
        }));
        /* to dispatch an action after d seconds i.e. when car will reach the parking place after travelling
        for d kms.
        */
        setTimeout(() => {
            dispatch(handleBookParkingUtil({
                arrivalTime: params.arrivalTime,
                parking: parkingDetails.parkingPlace,
                carNumber: params.carNumber,
                parkingDistance: parkingDetails.parkingDistance
            }))
        }, parkingDetails.parkingDistance * 2000)
    }
}

/**
 * To show the message that which car is assigned parking where
 * @param params
 * @returns {{type: *, payload: null, meta: *}}
 */
export function handleParkingAssignedMessage(params){
    return{
        type: ActionTypes.PARKING_ASSIGNED_MESSAGE,
        payload: null,
        meta: params
    }
}

/**
 * to display the message for shortest distance parking simulator
 * @param params
 * @returns {{type: *, payload: null, meta: *}}
 */
export function handleShortestParkingMessage(params){
    return {
        type: ActionTypes.SHORTEST_PARKING_MESSAGE,
        payload: null,
        meta: params
    }
}

/**
 * Action creator to show the current car on the map
 * @param params
 * @returns {{type: string, payload: {currCarPosition: {lattitude: number, longitude: number}|currCarPosition|{lattitude, longitude}, carNumber: *}, meta: *}}
 */
export function handleShowCurrentCarToMap(params){
    return{
        type: ActionTypes.SHOW_CURRENT_CAR,
        payload: {
            currCarPosition: params.currCarPosition,
            carNumber: params.carNumber
        },
        meta: params
    }
}

/**
 * Util action creator to get state and book or go to neighbours on basis of state.
 * @param params
 * @returns {Function}
 */
export function handleBookParkingUtil(params){
    return (dispatch, getState) => {
        let currArray = getState().parking2DArray;  //getting 2D array from state to check conditions
        let currParking = params.parking;   //parking which is assigned.
        let currIndex = currParking.index;  //index number of assigned parking

        let parkedAt;
        let timeOnRoad;
        let distanceTravelled;
        /**
         * checking if parking slot is available in assigned parking or not.
         */
        let assignedParkingAvailable = false;   //bool variable
        for(let i=0; i<currArray[currIndex].length; i++){
            if(currArray[currIndex][i] === 0){
                assignedParkingAvailable = true;
                /**
                 * dispatching action when the parking place is available: this means parking slot is available.
                 */
                dispatch(handleBookParking({
                    rowNumber: currIndex,
                    columnNumber: i,
                    data: PARKING_TIME,
                    meta: "optimal"
                }));
                /**
                 * dispatch action to print message that parking is booked.
                 */
                let parkingTime = (params.parkingDistance * 2).toFixed(2);
                dispatch(handleParkingAssignedMessage({
                    message: "Car " + params.carNumber + " has been parked to " + currParking.name + " after " +
                        parkingTime + ' secs.',
                    color: 'green'
                }));
                parkedAt =  currParking.name;
                timeOnRoad = parkingTime;
                distanceTravelled = params.parkingDistance;
                break;
            }
        }
        /**
         * if parking is not found in assigned parking. this false indicates the same.
         */
        let assignedNeighbourParking = false;
        if(assignedParkingAvailable === false) {
            /**
             * If the process reaches here, that means parking is not available where it has been directed
             * in the first stage. We will try to accommodate it to it's first neighbour.
             */
            let neighbours = currParking.neighbours_Ids;    //array of neighbours of assigned parking
            /**
             * checking all the neighbours and finding neighbour with minimum cost.
             */
            let minCost = 99999999; //to find minimum cost among all neighbours
            let minCostParking = {}; //this variable holds minimum cost parking, it is an object.
            let minCostDist = 0;    //to find distance between assigned parking and assigned neighbour
            //defaultParking is the array of objects. It contains all parking objects as an array.
            defaultParking.forEach(parking => {
                //checking if parking is in neighbour's list
                if (neighbours.indexOf(parking._id) > -1) {
                    //Code reached here means curr parking is in neighbour's list
                    let currParams = {
                        carIndex: parking.index,
                        currParking2DArray: currArray
                    };
                    /**
                     * this function find cost between two positions, it takes 5 parameters.
                     * @type {{curr_cost: number|*, curr_dist: number}}
                     */
                    let result = findCostBetweenTwoPositions(
                        currParking.lattitude,
                        currParking.longitude,
                        parking.lattitude,
                        parking.longitude,
                        currParams
                    );
                    /**
                     * if this has the minimum cost, we will update our parking where car should be redirected.
                     */
                    if (result.curr_cost < minCost) {
                        minCost = result.curr_cost;
                        minCostParking = parking;
                        minCostDist = result.curr_dist;
                    }
                }
            });
            /**
             * checking if the neighbour assigned parking has available space or not.
             * If available - we will book parking.
             * If not available - we will print that car cannot be parked
             */
            distanceTravelled = params.parkingDistance + minCostDist;
            timeOnRoad = (distanceTravelled * 2).toFixed(2);
            for (let i = 0; i < currArray[minCostParking.index].length; i++) {
                if (currArray[minCostParking.index][i] === 0) {
                    assignedNeighbourParking = true;
                    /**
                     * dispatching action when the parking place is available
                     */
                    dispatch(handleBookParking({
                        rowNumber: minCostParking.index,
                        columnNumber: i,
                        data: PARKING_TIME,
                        meta: "optimal"
                    }));
                    /**
                     * dispatch action to print message that parking is booked.
                     */
                    /**
                     * Note that toFixed() return string, hence totalParkingTime cannot be done like
                     * totalParkingTime =  parkingTime + addOnParkingTime || this will add as strings, hence wrong
                     * @type {string}
                     */
                    let parkingTime = (params.parkingDistance * 2).toFixed(2);
                    let addOnParkingTime = (minCostDist * 2).toFixed(2);
                    let totalParkingTime = ((params.parkingDistance + minCostDist) * 2).toFixed(2);
                    dispatch(handleParkingAssignedMessage({
                        message: "Car " + params.carNumber + " has been redirected to " + minCostParking.name  + " from " +
                            currParking.name + " and parked after " + totalParkingTime + ' (' + parkingTime + ', ' +
                            addOnParkingTime + ') secs.',
                        color: 'gold'
                    }));
                    parkedAt =  minCostParking.name;
                    break;
                }
            }

            /**
             * Parking failed even in the neighbours and hence we will mark this parking as failed.
             * dispatch message that parking has been failed
             */
            if(assignedNeighbourParking === false) {
                dispatch(handleParkingAssignedMessage({
                    message: "Car " + params.carNumber + " cannot be parked: No available space in " + currParking.name +
                    " and its assigned neighbour " + minCostParking.name + '.' ,
                    color: 'red'
                }));
                parkedAt =  "None";
            }
        }
        let tempParked = (assignedParkingAvailable === true || assignedNeighbourParking === true) ? "YES" : "NO";
        dispatch(handleSaveCarData({
            carName: "Car " + params.carNumber,
            parked: tempParked,
            arrivalTime: params.arrivalTime,
            parkingAssigned: currParking.name,
            parkedAt:parkedAt,
            timeOnRoad: timeOnRoad,
            distanceTravelled: distanceTravelled.toFixed(2),
            waitingTime: tempParked === "YES" ? timeOnRoad : timeOnRoad + 90
        }));
    }
}

/**
 * Action creator to book a parking i.e. add 10 secs to specific parking slot.
 * @param params
 * @returns {{type: string, payload: {parkingPlace, parkingDistance: number, parkingCost: number}|*, meta: *}}
 */
export function handleBookParking(params){
    return{
        type: ActionTypes.BOOK_PARKING,
        payload: {
            rowNumber: params.rowNumber,
            columnNumber: params.columnNumber,
            data: params.data,
            meta: params.meta
        },
        meta: params
    }
}

/**
 * this save the data of a car to state. Later used to generate csv file.
 * @param params
 * @returns {{type: string, payload: {carName: string|*, parked: string|*, arrivalTime: *, parkingAssigned: *, parkedAt: string, timeOnRoad: *, distanceTravelled: string | *}, meta: *}}
 */
export function handleSaveCarData(params){
    return{
        type: ActionTypes.SAVE_CAR_DATA,
        payload: {
            carName: params.carName,
            parked: params.parked,
            arrivalTime: params.arrivalTime,
            parkingAssigned: params.parkingAssigned,
            parkedAt:params.parkedAt,
            timeOnRoad: params.timeOnRoad,
            distanceTravelled: params.distanceTravelled,
            waitingTime: params.waitingTime
        },
        meta: params
    }
}

export function handleSaveShortestData(params){
    return{
        type: ActionTypes.SAVE_SHORTEST_DATA,
        payload: {
            carName: params.carName,
            arrivalTime: params.arrivalTime,
            parkingAssigned: params.parkingAssigned,
            timeOnRoad: params.timeOnRoad,
            distanceTravelled: params.distanceTravelled,
            waitingTime: params.waitingTime
        },
        meta: params
    }
}
//****************************************************************************************************

/**
 * To show, hide loading bar
 * @param params
 * @returns {{type: string}}
 */
export function handleLoadingBar(params){
    return{
        type: ActionTypes.SHOW_LOADING_BAR,
        payload: null,
        meta: params
    }
}

/**
 * Action creator to handle background action of decreasing availability time of each parking slot.
 * @param params
 * @returns {{type: string, payload: null, meta: *}}
 */
export function handleBackgroundAction(params){
    return{
        type: ActionTypes.BACKGROUND_ACTION,
        payload: null,
        meta: params
    }
}

/**
 * to stop the current ongoing simulation and reset
 * @param params
 * @returns {{type: string, payload: null, meta: *}}
 */
export function handleStopSimulation(params){
    return{
        type: ActionTypes.STOP_SIMULATION,
        payload: null,
        meta: params
    }
}

/**
 * to start the simulation
 * @param params
 * @returns {{type: string, payload: null, meta: *}}
 */
export function handleStartSimulation(params){
    return{
        type: ActionTypes.START_SIMULATION,
        payload: null,
        meta: params
    }
}

/**
 * to show map after simulation resumes
 * @param params
 * @returns {{type: *, payload: null, meta: *}}
 */
export function showMapToPage(params){
    return{
        type: ActionTypes.SHOW_MAP_TO_PAGE,
        payload: null,
        meta: params
    }
}

/**
 * to hide map from page
 * @param params
 * @returns {{type: string, payload: null, meta: *}}
 */
export function handleHideMapFromPage(params) {
    return {
        type: ActionTypes.HIDE_MAP_FROM_PAGE,
        payload: null,
        meta :params
    }
}

//**************************************  Helper functions start from here *********************************************************

/**
 * Util function to create or initialise the parking Data Structure.
 * @param parkings: the default array of parkings imported from constant
 * @returns parkingDS: 2D array that represents if any car is parked on any slot and time for availability of that slot
 */
function createParkingDS(parkings){
    let row = parkings.length;
    let parkingsDS = new Array(row);

    for(let i=0; i<row; i++){
        let col = parkings[i].parkingSpace;
        parkingsDS[i] = new Array(col);
    }

    for(let i=0; i<row; i++){
        for(let j=0; j<parkingsDS[i].length; j++){
            parkingsDS[i][j] = 0 ;
        }
    }
    return parkingsDS;
}

/**
 * //Util function to generate random coordinates on the basis of center and radius.
 * @returns {{lattitude: number, longitude: number}}
 */
function generateRandomPosition(){
    const y0 = DEFAULT_CENTER.lat;
    const x0 = DEFAULT_CENTER.lng;
    const rd = RADIUS / 111300;

    let w = rd * Math.sqrt(Math.random());
    let t = 2 * Math.PI * Math.random();
    let x = w * Math.cos(t);
    let y = w * Math.sin(t);

    return{
        lattitude: y + y0,
        longitude: x + x0
    }
}

/**
 * Util function to find the optimal parking place for current car
 * @param params
 * @returns {{parkingPlace, parkingDistance: number, parkingCost: number}}
 */

function findOptimalParking(params){
    let parkingCost = 9999999999;
    let parkingPlace = {};
    let parkingDistance = 0;

    let shortestParkingPlace = {};
    let shortestParkingDistance = 999999999;
    defaultParking.forEach(function(item){
        /**
         * to get distance between two coordinates
         */
        let currParams = {
            carIndex: item.index,
            currParking2DArray: params.currParking2DArray
        };
        let result = findCostBetweenTwoPositions(
            params.currCarPosition.lattitude,
            params.currCarPosition.longitude,
            item.lattitude,
            item.longitude,
            currParams
        );
        if(result.curr_cost < parkingCost){
            parkingCost = result.curr_cost;
            parkingPlace = item;
            parkingDistance = result.curr_dist;
        }
        if(result.curr_dist < shortestParkingDistance){
            shortestParkingDistance = result.curr_dist;
            shortestParkingPlace = item;
        }
    });
    return {
        parkingPlace: parkingPlace,
        parkingDistance: parkingDistance,
        parkingCost: parkingCost,
        shortestParkingPlace: shortestParkingPlace,
        shortestParkingDistance: shortestParkingDistance
    }
}

/**
 * to find cost and distance between two positions
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @param params
 * @returns {{curr_cost: number|*, curr_dist: number}}
 */
function findCostBetweenTwoPositions(lat1, lng1, lat2, lng2, params){
    let curr_cost;
    /**
     * to get distance between two coordinates
     */
    let currDist = getDistance(lat1, lng1, lat2, lng2);
    /**
     * to find the number of unavailable parking slots for current destination parking place.
     */
    let filled_parking_space = findFilledParkingSpace({
        carIndex: params.carIndex,
        currParking2DArray: params.currParking2DArray
    });

    let distRatio = currDist / MAX_DISTANCE;
    let spaceRatio = filled_parking_space / MAX_PARKING_SPACE;
    curr_cost = 0.2 * distRatio + 0.8 * spaceRatio;
    return {
        curr_cost: curr_cost,
        curr_dist: currDist
    };   //return cost between two parking
}

/**
 * Util function to get distance between two coordinates
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
function getDistance(lat1,lon1,lat2,lon2){
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     // Distance in km
    return R * c;
}

/**
 * util function to convert degree to radian
 * @param deg
 * @returns {number}
 */
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

/**
 * Util function to find the current number of unavailable parking slots from a parking space
 * @param params
 * @returns {number}
 */
function findFilledParkingSpace(params){
    let parking2DArray = params.currParking2DArray;
    let carIndex = params.carIndex;
    let filled_parking_space = 0;
    for(let i=0; i<parking2DArray[carIndex].length; i++){
        if(parking2DArray[carIndex][i] !== 0)
            filled_parking_space++;
    }
    return filled_parking_space;
}