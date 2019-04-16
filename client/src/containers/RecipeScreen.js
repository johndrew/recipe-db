import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as recipeActions from '../store/recipes/actions';
import * as recipeSelectors from '../store/recipes/reducer';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import ErrorCard from '../components/ErrorCard/ErrorCard';

class RecipeScreen extends Component {

    render() {

        const { error_message, recipes } = this.props;
        return (
            <div className="recipeScreen__container">
                {!recipes.length && <ErrorCard message={error_message} />}
                {recipes.length && recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
        );
    }

    async componentDidMount() {
  
        this.props.dispatch(recipeActions.fetchRecipes());
    }
}

function mapStateToProps(state) {
    
    return {
        error_message: recipeSelectors.getError(state),
        recipes: recipeSelectors.getAllRecipes(state),
    }
}

export default connect(mapStateToProps)(RecipeScreen);