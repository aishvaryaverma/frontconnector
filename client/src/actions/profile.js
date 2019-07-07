import { GET_PROFILE, PROFILE_ERROR } from './types';
import axios from 'axios';

export const getCurrentProfile = () => async dispatch => {
    try {
        // const res = await axios.get(`${process.env.REACT_APP_SERVER}/api/profile/me`);
        const res = await axios.get(`/api/profile/me`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        // console.log(err);
        if(err.response.status === 400) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.data.msg, status: err.response.status }
            });
        }
    }
};

