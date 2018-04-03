import * as ActionTypes from '../consts/actionTypes';
import { decreaseOneSecond } from '../consts/externalFunctions';
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

    case ActionTypes.SHORTEST_DIST_PARKING:
    	return {
            ...state,
            messgae: "parking fetched on the basis of distance",
            shortestDistParking: action.payload.shortestDistParking,
            shortestDist: action.payload.shortestDist
        };

    case ActionTypes.OPTIMAL_PARKING:
    	return {
            ...state,
            message: "parking fetched on the basis of optimal algorithm",
            optimalParking: action.payload.optimalParking,
            optimalParkingCost: action.payload.optimalParkingCost
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
            carStatusMessage: [...state.carStatusMessage,
                "Car " + action.meta.carNumber + " wants to be parked."
                ]
        };

    case ActionTypes.BOOK_PARKING:
        return {
            ...state
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