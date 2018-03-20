import * as ActionTypes from '../consts/actionTypes';
import axios from 'axios';
import { URL } from '../consts/otherConstants';

export function handleLogin(params) {

    return function(dispatch){

        let data = {
            email: params.email,
            password: params.password
        }

        axios.post(URL + 'user/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.LOG_IN_USER_SUCCESS,
            payload: response.data
        }))
        .catch((err) => dispatch({
            type: ActionTypes.LOG_IN_USER_FAILURE,
            payload: err.response
        }))
    }
}

export function handleSignUp(params) {
    
    return function(dispatch){

        let data = {
            name: params.name,
            email: params.email,
            password: params.password
        }
        
        axios.post(URL + 'user/signup', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.SIGN_UP_USER_SUCCESS,
            payload: response.data
        }))
        .catch((err) => dispatch({
            type: ActionTypes.SIGN_UP_USER_FAILURE,
            payload: err.response
        }))
    }
}

export function fetchParkings(params) {
    
    return function(dispatch){
        axios.get(URL + 'parkings', {
           headers: {
                'Content-Type': 'application/json'
            } 
        })
        .then((response) => dispatch({
            type: ActionTypes.FETCH_PARKINGS_SUCCESS,
            payload: response.data
        }))
        .catch((err) => dispatch({
            type: ActionTypes.FETCH_PARKINGS_FAILURE,
            payload: err.response
        }))
    }
}

export function fetchShortestParking(params) {
    
    return function(dispatch){

        axios.get(URL + 'shortest-dist?lattitude='
            + params.location.lattitude + '&longitude=' + params.location.longitude, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.SHORTEST_DIST_PARKING_SUCCESS,
            payload: response.data
        }))
        .catch((err) => dispatch({
            type: ActionTypes.SHORTEST_DIST_PARKING_FAILURE,
            payload: err.response
        }))
    }
}

export function fetchOptimalParking(params) {
    
    return function(dispatch){
        
        axios.get(URL + 'our-algo?lattitude='
            + params.location.lattitude + '&longitude=' + params.location.longitude, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.OUR_ALGO_PARKING_SUCCESS,
            payload: response.data
        }))
        .catch((err) => dispatch({
            type: ActionTypes.OUR_ALGO_PARKING_FAILURE,
            payload: err.response
        }))
    }
}

export function handleLogout(params){
    return {
        type: ActionTypes.LOG_OUT_USER,
        payload: params
    }
}

export function showCurrentParkingFromMap(params){
    return {
        type: ActionTypes.SHOW_CURRENT_PARKING_FROM_MAP,
        payload: params
    }
}


