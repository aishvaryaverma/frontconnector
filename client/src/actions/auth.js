import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from './types';

export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        // This will set HEADERS for HTTP Request
        setAuthToken(localStorage.token);
    }
    try {
        // Getting user from database (using our backend API)
        const res = await axios.get('api/auth');

        // Dispatching action and payload to Reducer
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        // Dispatching action to Reducer
        dispatch({
            type: AUTH_ERROR
        })
    }
};

export const register = ({name, email, password}) => async dispatch => {
    try {
        const config = {
            headers: {
              'Content-type': 'application/json'
            }
        };
        const body = JSON.stringify({name, email, password});
        const res = await axios.post('/api/users', body, config);

        // Dispatching action and payload to Reducer
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        // Showing alerts msg to user
        setAlert("Registered Successfully", 'success');
    } catch (err) {
        // Showing server side error msg to users
        const errors = err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger') ))
        }
        
        // Dispatching action to Reducer
        dispatch({type: REGISTER_FAIL});
    }
}