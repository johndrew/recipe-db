import * as types from './actionTypes';
import recipeService from '../../services/recipeService';

export function fetchRecipes() {
    
    return async (dispatch) => {

        try {
            
            const recipes = await recipeService.getRecipes();
            dispatch({
                type: types.RECIPES_FETCHED,
                recipes,
            });
        } catch (e) {
            
            dispatch({
                type: types.FETCH_ERROR,
                error_message: e.message,
            });
        }        
    };
}