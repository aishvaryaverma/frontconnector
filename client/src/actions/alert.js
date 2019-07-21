import { SET_ALERT, REMOVE_ALERT, REMOVE_ALL_ALERT } from './types';
import uuid from 'uuid';

export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
    const id = uuid.v4();

    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

export const removeAlert = id => dispatch => {
    dispatch({ type: REMOVE_ALERT, payload: id })
};

export const clearAllAlerts = id => dispatch => {
    dispatch({ type: REMOVE_ALL_ALERT })
};