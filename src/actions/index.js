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

export function fetchParkings(params) {
    
    return function(dispatch){
        axios.get(URL + 'parkings', {
           headers: {
                'Content-Type': 'application/json'
            } 
        })
        .then((response) => dispatch({
            type: ActionTypes.FETCH_PARKINGS_SUCCESS,
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.FETCH_PARKINGS_FAILURE,
            payload: err.response,
            meta: params
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
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.SHORTEST_DIST_PARKING_FAILURE,
            payload: err.response,
            meta: params
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
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.OUR_ALGO_PARKING_FAILURE,
            payload: err.response,
            meta: params
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

export function showLoadingBar(params){
    return {
        type: ActionTypes.SHOW_LOADING_BAR,
        payload: params
    }
}

export function bookParkingSlot(params){
    return function(dispatch){
        
        let currPark = params.parkingToUpdate;
        let data = [{
            "propName": "free_parking_space",
            "value": params.parkingToUpdate.free_parking_space - 1
        }]

        axios.patch(URL + 'parkings/' + params.parkingToUpdate._id, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.BOOK_PARKING_SUCCESS,
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.BOOK_PARKING_FAILURE,
            payload: err.response,
            meta: params
        }))
    }
}

export function resetToDefault(params){
    return function(dispatch){
      
        axios.get(URL + 'parkings/reset', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => dispatch({
            type: ActionTypes.RESET_TO_DEFAULT_SUCCESS,
            payload: response.data,
            meta: params
        }))
        .catch((err) => dispatch({
            type: ActionTypes.RESET_TO_DEFAULT_FAILURE,
            payload: err.response,
            meta: params
        }))
    }
}


