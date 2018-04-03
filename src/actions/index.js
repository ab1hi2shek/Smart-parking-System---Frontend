import * as ActionTypes from '../consts/actionTypes';
import axios from 'axios';
import { URL, DEFAULT_CENTER, RADIUS } from '../consts/otherConstants';
import { defaultParking } from '../consts/parkings';

export function handleLogin(params){
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

export function handleLogout(params){
    return {
        type: ActionTypes.LOG_OUT_USER,
        payload: null,
        meta: params
    }
}

export function handleFetchParkings(params){

    let parking2DArray = createParkingDS(defaultParking);
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

export function handleShowCurrentCarToMap(params){
    let currCarPosition = generateRandomPosition();
    return{
        type: ActionTypes.SHOW_CURRENT_CAR,
        payload: {
            currCarPosition: currCarPosition
        },
        meta: params
    }
}

export function handleBookParking(params){
    return{
        type: ActionTypes.BOOK_PARKING
    }
}

export function handleShortestDistParking(params){
    return{
        type: ActionTypes.SHORTEST_DIST_PARKING
    }
}

export function handleOptimalAlgoParking(params){
    return{
        type: ActionTypes.OPTIMAL_PARKING
    }
}

export function handleLoadingBar(params){
    return{
        type: ActionTypes.SHOW_LOADING_BAR
    }
}

export function handleBackgroundAction(params){
    return{
        type: ActionTypes.BACKGROUND_ACTION,
        payload: null,
        meta: params
    }
}

export function handleStopSimulation(params){
    return{
        type: ActionTypes.STOP_SIMULATION,
        payload: null,
        meta: params
    }
}

export function handleStartSimulation(params){
    return{
        type: ActionTypes.START_SIMULATION,
        payload: null,
        meta: params
    }
}

//**************************************  Helper functions start from here *********************************************************

function createParkingDS(parkings){
    let row = parkings.length;
    let parkingsDS = new Array(row);

    for(let i=0; i<row; i++){
        let col = parkings[i].parkingSpace;
        parkingsDS[i] = new Array(col);
    }

    for(let i=0; i<row; i++){
        for(let j=0; j<parkingsDS[i].length; j++){
            parkingsDS[i][j] = Math.floor(Math.random() * 10) + 1 ;
        }
    }
    return parkingsDS;
}

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