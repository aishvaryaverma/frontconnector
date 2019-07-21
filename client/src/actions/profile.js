import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
    UPDATE_PROFILE,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	ACCOUNT_DELETED,
	REMOVE_ALL_ALERT
} from './types';

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
		
		dispatch({ type: REMOVE_ALL_ALERT });
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
		
		if (!edit) {
			// Back to dashboard if Profile Created
			history.push('/dashboard');
        }
	} catch (err) {
		dispatch({ type: REMOVE_ALL_ALERT });
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

// Add Experience 
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});
		dispatch({ type: REMOVE_ALL_ALERT });
        dispatch(setAlert('Experience Added', 'success'));
        window.scrollTo(0, 0);
        history.push('/dashboard');
	} catch (err) {
		dispatch({ type: REMOVE_ALL_ALERT });
		const errors = err.response.data.errors;
        if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
        dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
        });
        window.scrollTo(0, 0);
	}
}

// Add Experience 
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});
		dispatch({ type: REMOVE_ALL_ALERT });
        dispatch(setAlert('Education Added', 'success'));
        window.scrollTo(0, 0);		
        history.push('/dashboard');
	} catch (err) {
		dispatch({ type: REMOVE_ALL_ALERT });
		const errors = err.response.data.errors;
        if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
        dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
        });
        window.scrollTo(0, 0);
	}
}

// Delete Experience
export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});
		dispatch({ type: REMOVE_ALL_ALERT });
        dispatch(setAlert('Experience Deleted', 'success'));
        window.scrollTo(0, 0);
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
        });
        window.scrollTo(0, 0);
	}
};

// Delete Education
export const deleteEducation = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});
		dispatch({ type: REMOVE_ALL_ALERT });
        dispatch(setAlert('Education Deleted', 'success'));
        window.scrollTo(0, 0);
	} catch (err) {
        dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
        });
        window.scrollTo(0, 0);
	}
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone!')) {
		try {
			await axios.delete('/api/profile');

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETED });
			dispatch({ type: REMOVE_ALL_ALERT });
			dispatch(setAlert('Your account has been permanantly deleted', 'info'));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status }
			});
		}
	}
};

// Get all profiles
export const getProfiles = () => async dispatch => {
	dispatch({ type: CLEAR_PROFILE });

	try {
		const res = await axios.get('/api/profile');

		dispatch({
			type: GET_PROFILES,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// Get profile by ID
export const getProfileById = userId => async dispatch => {
	try {
		const res = await axios.get(`/api/profile/user/${userId}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

// Get Github repos
export const getGithubRepos = username => async dispatch => {
	try {
		const res = await axios.get(`/api/profile/github/${username}`);

		dispatch({
			type: GET_REPOS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};