import * as ActionTypes from'../consts/actionTypes';

const parkings = (state = {}, action) => {

	switch (action.type) {
    
    case ActionTypes.LOG_IN_USER_SUCCESS:
    	return {
            message: "login successful",
            status: 1,
            name: action.payload.name,
            email: action.payload.email,
            token: action.payload.token,
            login: true,
            isLoading: false
        }

    case ActionTypes.LOG_IN_USER_FAILURE:
        return {
            message: "Login failed - Try again.",
            status: 0,
            login: false,
            isLoading: false
        }

    case ActionTypes.SIGN_UP_USER_SUCCESS:
        return {
            message: "You have registered successfully with email " +
                action.meta.email + " Login now.",
            status: 1,
            isLoading: false
        }

    case ActionTypes.SIGN_UP_USER_FAILURE:
        return {
            message: "Registration failed",
            status: 0,
            isLoading: false
        }

    case ActionTypes.FETCH_PARKINGS_SUCCESS:
    	return {
            message: "parking fetched successfully",
            status: 1,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: action.payload.parkings,
            isLoading: false
        }

    case ActionTypes.FETCH_PARKINGS_FAILURE:
        return {
            message: "parking fetching failed",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            isLoading: false
        }

    case ActionTypes.SHORTEST_DIST_PARKING_SUCCESS:
    	return {
            message: "parking successfully found using shortest distance",
            status: 1,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings,
            shortest_dist_parking: action.payload.minimumDistanceParking,
            shortest_dist: action.payload.minimumDistance,
            isLoading: false
        }

    case ActionTypes.SHORTEST_DIST_PARKING_FAILURE:
        return {
            message: "Request failed - Network error. Please try again.",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings,
            isLoading: false
        }

    case ActionTypes.OUR_ALGO_PARKING_SUCCESS:
    	return {
            message: "parking successfully found using optimal algorithm",
            status: 1,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings,
            our_algo_parking: action.payload.minCostParking,
            our_algo_cost: action.payload.minimumCost,
            isLoading: false
        }

    case ActionTypes.OUR_ALGO_PARKING_FAILURE:
        return {
            message: "parking fetching failed using optimal algorithm",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings,
            isLoading: false
        }

    case ActionTypes.LOG_OUT_USER:
        return {
            message: "log out successful",
            status: 1
        }

    case ActionTypes.SHOW_CURRENT_PARKING_FROM_MAP:
        return {
            ...state,
            parkingToShowFromMap: {
                lattitude: action.payload.lattitude,
                longitude: action.payload.longitude
            }
        }

    case ActionTypes.SHOW_LOADING_BAR:
        return {
            ...state,
            isLoading: true
        }

    default:
        return state

    }
}
 
export default parkings;