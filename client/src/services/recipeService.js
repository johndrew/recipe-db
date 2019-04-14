const _ = require('lodash');

class RecipeService {

    constructor() {

        this.recipes = [];
    }

    async getRecipes() {

        return await fetch('https://us-central1-recipedb-d75ba.cloudfunctions.net/listDb', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(result => result.json())
            .then((data) => {
                
                this.recipes = _.sortBy(data, 'name');

                return this.recipes;
            })
            .catch((e) => {
                
                throw new Error(`Could not get recipes: ${e.message}`);
            });
    }
}

export default new RecipeService();