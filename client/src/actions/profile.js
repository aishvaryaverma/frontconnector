import { GET_PROFILE, PROFILE_ERROR } from './types';
import { setAlert } from './alert';
import axios from 'axios';

// Get Current logged in user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        // const res = await axios.get(`${process.env.REACT_APP_SERVER}/api/profile/me`);
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        if(err.response.status === 400) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.data.msg, status: err.response.status }
            });
        }
        // console.clear();
    }
};

// Create and Update Profile Action
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const res = await axios.post('/api/profile', formData, config);
		
        dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
		
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
		
		if (!edit) {
			history.push('/dashboard');
        }
	} catch (err) {
		const errors = err.response.data.errors;

        if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		
        dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
        });
	}
};