import { fromJS } from 'immutable';
import * as types from './actionTypes';

export const INITIAL_STATE = fromJS({
    error_message: '',
    recipes: [],
})

export default function reduce(state = INITIAL_STATE, action = {}) {
    
    switch (action.type) {
        case types.FETCH_ERROR: return state.merge({ error_message: action.error_message });
        case types.RECIPES_FETCHED: return state.merge({ recipes: action.recipes });
        default: return state;
    }
}

// SELECTORS

export function getAllRecipes(state) {
    
    return state.recipes.get('recipes');
}

export function getPagedRecipes(state, start_index, end_index) {

    const recipes = state.recipes.get('recipes');
    return {
        total_count: recipes.length,
        recipes: recipes.slice(start_index, end_index),
    };
}

export function getError(state) {
    
    return state.recipes.get('error_message');
}