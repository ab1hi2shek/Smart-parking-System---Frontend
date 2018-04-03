/**
 * created by ABHISHEK KUMAR
 * Date: 01 Apr 2018
 */
import * as ActionTypes from '../consts/actionTypes';
import axios from 'axios';
import { URL, DEFAULT_CENTER, RADIUS, MAX_DISTANCE, MAX_PARKING_SPACE } from '../consts/otherConstants';
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
    /**
     * return the type, payload and meta data.
     */
    return {
        type: ActionTypes.FETCH_PARKINGS,
        payload: {
            defaultParking: defaultParking,
            parking2DArray: parking2DArray,
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
        dispatch(handleAllAboutParking({
            currParking2DArray: currParking2DArray,
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
    //to find the optimal parking place for the current car
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
         * to dispatch an action to show message that which car has been parked where
         */
        dispatch(handleParkingAssignedMessage({
            parkingPlace: parkingDetails.parkingPlace,
            carNumber: params.carNumber
        }));
        /* to dispatch an action after d seconds i.e. when car will reach the parking place after travelling
        for d kms.
        */
        setTimeout(() => {
            dispatch(handleBookParking({
                parking: parkingDetails.parkingPlace,
                carNumber: params.carNumber
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
 * Action creator to book a parking i.e. add 10 secs to specific parking slot.
 * @param params
 * @returns {{type: string, payload: {parkingPlace, parkingDistance: number, parkingCost: number}|*, meta: *}}
 */
export function handleBookParking(params){
    return{
        type: ActionTypes.BOOK_PARKING,
        payload: {
            parking: params.parking,
            carNumber: params.carNumber
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
    let max_parking_space = MAX_PARKING_SPACE;
    let max_distance = MAX_DISTANCE;
    let parkingCost = 9999999999;
    let parkingPlace = {};
    let parkingDistance = 0;
    defaultParking.forEach(function(item){
        /**
         * to get distance between two coordinates
         */
        let currDist = getDistance(params.currCarPosition.lattitude, params.currCarPosition.longitude,
            item.lattitude, item.longitude);
        /**
         * to find the number of unavailable parking slots for current parking place.
         */
        let filled_parking_space = findFilledParkingSpace({
            carIndex: item.index,
            currParking2DArray: params.currParking2DArray
        });

        let distRatio = currDist/max_distance;
        let spaceRatio = filled_parking_space/max_parking_space;
        let curr_cost = 0.2 * distRatio + 0.8 * spaceRatio;

        if(curr_cost < parkingCost){
            parkingCost = curr_cost;
            parkingPlace = item;
            parkingDistance = currDist;
        }
    });
    return {
        parkingPlace: parkingPlace,
        parkingDistance: parkingDistance,
        parkingCost: parkingCost
    }
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