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
                
                this.recipes = data;

                return this.recipes;
            })
            .catch((e) => {
                
                console.error('Could not get recipes', e);
                return [];
            });
    }
}

export default new RecipeService();