import * as ActionTypes from '../consts/actionTypes';
import { decreaseOneSecond } from '../consts/externalFunctions';

/**
 * reducer function
 * @param state
 * @param action
 * @returns {*}
 */
const parkings = (state = {}, action) => {

	switch (action.type) {

        case ActionTypes.LOG_IN_USER_SUCCESS: {
            return {
                message: "login successful",
                status: 1,
                name: action.payload.name,
                email: action.payload.email,
                login: true,
                isLoading: false
            };
        }

        case ActionTypes.LOG_IN_USER_FAILURE: {
            return {
                message: "Login failed - Try again.",
                status: 0,
                login: false,
                isLoading: false
            };
        }

        case ActionTypes.SIGN_UP_USER_SUCCESS: {
            return {
                message: "You have registered successfully with email " +
                action.meta.email + ". Please Login now.",
                status: 1,
                isLoading: false
            };
        }

        case ActionTypes.SIGN_UP_USER_FAILURE: {
            return {
                message: "Registration failed",
                status: 0,
                isLoading: false
            };
        }

        case ActionTypes.FETCH_PARKINGS: {
            return {
                ...state,
                message: "parking fetch successful",
                parkings: action.payload.defaultParking,
                currCarPosition: {
                    lattitude: 0,
                    longitude: 0
                },
                parking2DArray: action.payload.parking2DArray,
                shortestParking2DArray: action.payload.shortestParking2DArray,
                simulation: action.payload.simulation,
                carStatusMessage: [],
                shortestCarStatusMessage: []
            };
        }

        case ActionTypes.LOG_OUT_USER: {
            return {
                message: "log out successful",
                login: false,
                status: 1,
                simulation: false
            };
        }

        case ActionTypes.SHOW_CURRENT_CAR: {
            return {
                ...state,
                carLocationShown: true,
                currCarPosition: action.payload.currCarPosition,
                carStatusMessage: [
                    {
                        message: "Car " + action.payload.carNumber + " wants to be parked.",
                        color: 'blue'
                    },
                    ...state.carStatusMessage
                ]
            };
        }

        case ActionTypes.BOOK_PARKING: {
            if(action.payload.meta === 'optimal') {
                let currArray = state.parking2DArray;
                currArray[action.payload.rowNumber][action.payload.columnNumber] = action.payload.data;
                return {
                    ...state,
                    parking2DArray: currArray,
                };
            }
            else{
                let currShortestParking2DArray = state.shortestParking2DArray;
                currShortestParking2DArray[action.payload.rowNumber][action.payload.columnNumber] = action.payload.data;
                return {
                    ...state,
                    shortestParking2DArray: currShortestParking2DArray,
                };
            }
        }

        case ActionTypes.SHOW_LOADING_BAR: {
            return {
                ...state,
                isLoading: true
            };
        }

        case ActionTypes.BACKGROUND_ACTION: {
            let currParking2DArray = state.parking2DArray;
            let currShortestParking2DArray = state.shortestParking2DArray;
            let result = decreaseOneSecond({
                currParking2DArray: currParking2DArray,
                currShortestParking2DArray: currShortestParking2DArray
            });

            return {
                ...state,
                parking2DArray: result.parking2DArray,
                shortestParking2DArray: result.shortestParking2DArray
            };
        }

        case ActionTypes.PARKING_ASSIGNED_MESSAGE:{
            return {
                ...state,
                carStatusMessage: [
                    {
                        message: action.meta.message,
                        color: action.meta.color
                    },
                    ...state.carStatusMessage
                ]
            };
        }

        case ActionTypes.SHORTEST_PARKING_MESSAGE:{
            return {
                ...state,
                shortestCarStatusMessage: [
                    {
                        message: action.meta.message,
                        color: action.meta.color
                    },
                    ...state.shortestCarStatusMessage
                ]
            };
        }

        case ActionTypes.START_SIMULATION: {
            return {
                ...state,
                carStatusMessage: [],
                carParkingData: [],
                shortestParkingData: [],
                optimalTotalWaitingTime: 0,
                shortestTotalWaitingTime: 0,
                simulation: true
            };
        }

        case ActionTypes.STOP_SIMULATION: {
            return {
                ...state,
                simulation: false
            };
        }

        case ActionTypes.SAVE_CAR_DATA: {
            return {
                ...state,
                optimalTotalWaitingTime: state.optimalTotalWaitingTime + parseFloat(action.payload.waitingTime),
                carParkingData: [
                    ...state.carParkingData,
                    {
                        carName: action.payload.carName,
                        parked: action.payload.parked,
                        arrivalTime: action.payload.arrivalTime,
                        parkingAssigned: action.payload.parkingAssigned,
                        parkedAt:action.payload.parkedAt,
                        timeOnRoad: action.payload.timeOnRoad,
                        distanceTravelled: action.payload.distanceTravelled,
                        waitingTime: action.payload.waitingTime
                    }
                ]
            }
        }

        case ActionTypes.SAVE_SHORTEST_DATA: {
            let currData = state.shortestTotalWaitingTime;
            currData = currData + parseFloat(action.payload.waitingTime);
            return {
                ...state,
                shortestTotalWaitingTime: currData,
                shortestParkingData: [
                    ...state.shortestParkingData,
                    {
                        carName: action.payload.carName,
                        arrivalTime: action.payload.arrivalTime,
                        parkingAssigned: action.payload.parkingAssigned,
                        timeOnRoad: action.payload.timeOnRoad,
                        distanceTravelled: action.payload.distanceTravelled,
                        waitingTime: action.payload.waitingTime
                    }
                ]
            }
        }

        case ActionTypes.SHOW_MAP_TO_PAGE: {
            return {
                ...state,
                hideMap: false
            }
        }

        case ActionTypes.HIDE_MAP_FROM_PAGE: {
            return {
                ...state,
                hideMap: true
            }
        }

        default:
            return state
        }
};
 
export default parkings;