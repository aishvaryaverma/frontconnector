import type from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
    switch(action.type) {
        case type.SET_ALERT :
            return [ ...state, action.payload ]
        case type.REMOVE_ALERT :
            return state.filter(alert => alert.id !== action.payload)
        default :
            return state;
    }
}