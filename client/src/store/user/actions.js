import * as types from './actionTypes';
import userService from '../../services/userService';

export function login(email, password) {

    return async (dispatch) => {

        dispatch({ type: types.LOGIN_PENDING });
        try {
            
            const session = await userService.login(email, password);
            dispatch({ type: types.LOGIN_SUCCESS, session });
            return;
        } catch (e) {
            
            console.error(e);
            dispatch({ type: types.LOGIN_ERROR, message: e.message });
            return;
        }
    };
}