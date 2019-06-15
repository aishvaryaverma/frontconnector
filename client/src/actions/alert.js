import type from './types';
import uuid from 'uuid';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid.v4();

    dispatch({
        type: type.SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: type.REMOVE_ALERT, payload: id }), timeout);
}