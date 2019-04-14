import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as recipeActions from '../store/recipes/actions';
import * as recipeSelectors from '../store/recipes/reducer';

class RecipeScreen extends Component {

    constructor(props) {

        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className="recipeScreen__container">
                {this.props.recipes.map(recipe => <p key={recipe.id}>{recipe.name}</p>)}
            </div>
        );
    }

    async componentDidMount() {
  
        this.props.dispatch(recipeActions.fetchRecipes());
    }
}

function mapStateToProps(state) {
    
    return {
        recipes: recipeSelectors.getPagedRecipes(state, 0, 10),
    }
}

export default connect(mapStateToProps)(RecipeScreen);