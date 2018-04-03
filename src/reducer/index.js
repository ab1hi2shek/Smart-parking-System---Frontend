import * as ActionTypes from '../consts/actionTypes';
import { decreaseOneSecond } from '../consts/externalFunctions';
import { PARKING_TIME } from "../consts/otherConstants";

/**
 * reducer function
 * @param state
 * @param action
 * @returns {*}
 */
const parkings = (state = {}, action) => {

	switch (action.type) {

    case ActionTypes.LOG_IN_USER_SUCCESS:
    	return {
            message: "login successful",
            status: 1,
            name: action.payload.name,
            email: action.payload.email,
            login: true,
            isLoading: false
        };

    case ActionTypes.LOG_IN_USER_FAILURE:
        return {
            message: "Login failed - Try again.",
            status: 0,
            login: false,
            isLoading: false
        };

    case ActionTypes.SIGN_UP_USER_SUCCESS:
        return {
            message: "You have registered successfully with email " +
                action.meta.email + ". Please Login now.",
            status: 1,
            isLoading: false
        };

    case ActionTypes.SIGN_UP_USER_FAILURE:
        return {
            message: "Registration failed",
            status: 0,
            isLoading: false
        };

    case ActionTypes.FETCH_PARKINGS:
    	return {
            ...state,
            message: "parking fetch successful",
            parkings: action.payload.defaultParking,
            currCarPosition: {
                lattitude: 0,
                longitude: 0
            },
            parking2DArray: action.payload.parking2DArray,
            simulation: action.payload.simulation,
            carStatusMessage: []
        };

    case ActionTypes.LOG_OUT_USER:
        return {
            message: "log out successful",
            login: false,
            status: 1,
            simulation: false
        };

    case ActionTypes.SHOW_CURRENT_CAR:
        return {
            ...state,
            carLocationShown: true,
            currCarPosition: action.payload.currCarPosition,
            carStatusMessage: [
                "Car " + action.payload.carNumber + " wants to be parked.",
                ...state.carStatusMessage
            ]
        };

    case ActionTypes.BOOK_PARKING:
        let parkingToBook = action.payload.parking;
        let currIndex = parkingToBook.index;
        let currArray = state.parking2DArray;
        let currCarNumber = action.payload.carNumber;

        for(let i=0; i<currArray[currIndex].length; i++){
            if(currArray[currIndex][i] === 0){
                currArray[currIndex][i] = PARKING_TIME;
                return{
                    ...state,
                    parking2DArray: currArray,
                    carStatusMessage: [
                        "Car " + currCarNumber + " has been parked to " + parkingToBook.name + ".",
                        ...state.carStatusMessage
                    ]
                }
            }
        }
        return {
            ...state,
            carStatusMessage: [
                "Car " + currCarNumber + " cannot be parked: No available space in " + parkingToBook.name + ".",
                ...state.carStatusMessage
            ]
        };

    case ActionTypes.SHOW_LOADING_BAR:
        return {
            ...state,
            isLoading: true
        };

    case ActionTypes.BACKGROUND_ACTION:
        let currParking2DArray = state.parking2DArray;
        currParking2DArray = decreaseOneSecond(currParking2DArray);

        return {
            ...state,
            parking2DArray: currParking2DArray
        };

        case ActionTypes.PARKING_ASSIGNED_MESSAGE:
            return{
                ...state,
                carStatusMessage: [
                    "Car " + action.meta.carNumber + " is assigned to parking " + action.meta.parkingPlace.name + ".",
                    ...state.carStatusMessage
                ]
            };

        case ActionTypes.START_SIMULATION:
            return{
                ...state,
                simulation: true
            };

        case ActionTypes.STOP_SIMULATION:
            return{
                ...state,
                simulation: false
            };

    default:
        return state
    }
};
 
export default parkings;