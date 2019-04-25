import { fromJS } from 'immutable';
import * as types from './actionTypes';

export const INITIAL_STATE = fromJS({
    session: null,
    login_pending: false,
    login_error: null,
});

export default function reduce(state = INITIAL_STATE, action = {}) {
    
    switch (action.type) {

        case types.LOGIN_ERROR: return state.merge({
            login_error: action.message,
            login_pending: false,
        });
        case types.LOGIN_PENDING: return state.merge({
            login_pending: true,
        });
        case types.LOGIN_SUCCESS: return state.merge({
            session: action.session,
            login_error: null,
            login_pending: false,
        });
        default: return state;
    }
}

// SELECTORS

export function getErrorMessage(state) {
    
    return state.user.get('login_error');
}

export function loginPending(state) {
    
    return state.user.get('login_pending');
}