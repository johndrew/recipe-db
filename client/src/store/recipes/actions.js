import * as types from './actionTypes';
import recipeService from '../../services/recipeService';

export function fetchRecipes() {
    
    return async (dispatch, getState) => {

        dispatch({
            type: types.RECIPES_FETCHED,
            recipes: await recipeService.getRecipes(),
        });
    };
}