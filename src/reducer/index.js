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
            login: true
        }

    case ActionTypes.LOG_IN_USER_FAILURE:
        return {
            message: "login failed",
            status: 0,
            login: false
        }

    case ActionTypes.SIGN_UP_USER_SUCCESS:
        return {
            message: "You have been registered successfully. Login now",
            status: 1
        }

    case ActionTypes.SIGN_UP_USER_FAILURE:
        return {
            message: "Registration failed",
            status: 0
        }

    case ActionTypes.FETCH_PARKINGS_SUCCESS:
    	return {
            message: "parking fetched successfully",
            status: 1,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: action.payload.parkings
        }

    case ActionTypes.FETCH_PARKINGS_FAILURE:
        return {
            message: "parking fetching failed",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token
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
            shortest_dist: action.payload.minimumDistance

        }

    case ActionTypes.SHORTEST_DIST_PARKING_FAILURE:
        return {
            message: "parking fetching failed using shortest distance",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings
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
            our_algo_parking: action.payload.minimumCostParking,
            our_algo_cost: action.payload.minimumCost

        }

    case ActionTypes.OUR_ALGO_PARKING_FAILURE:
        return {
            message: "parking fetching failed using optimal algorithm",
            status: 0,
            login: true,
            name: state.name,
            email: state.email,
            token: state.token,
            parkings: state.parkings
        }

    case ActionTypes.LOG_OUT_USER:
        return {
            message: "log out successful",
            status: 1
        }

    default:
        return state

    }
}
 
export default parkings;