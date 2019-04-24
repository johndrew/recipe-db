import { fromJS } from 'immutable';
import * as types from './actionTypes';

export const INITIAL_STATE = fromJS({
    session: null,
    name: '',
});

export default function reduce(state = INITIAL_STATE, action = {}) {
    
    switch (action.type) {

        case types.LOGIN_SUCCESS: return state.merge({
            session: action.session,
            name: action.name,
        });
        default: return state;
    }
}