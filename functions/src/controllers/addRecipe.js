const uuid = require('uuid/v4');
const _ = require('lodash');

module.exports = {
    addRecipe: addRecipe,
    bulkAddRecipe: bulkAddRecipe,
}

/**
 * @typedef {Object} AWSRecipe Represents the structure used when storing recipes in AWS DynamoDB
 * @prop {string} name
 * @prop {string} link
 * @prop {string} category
 * @prop {String[]} ingredients
 */

function addRecipe() {
    
    res.send('It works yo!');
    return;
}

function bulkAddRecipe(recipes, admin) {

    try {
        
        console.log('Loading db client.');
        const db = admin.firestore();

        console.log('Saving only first recipe');
        return addAWSRecipe(db, recipes[0]);
    } catch (e) {
        
        console.error('Failed to add recipe', e);
        return Promise.reject(e.message);
    }
}

/**
 * Takes a recipe object in AWS format and saves it to Firestore
 * @param {AWSRecipe} recipe
 */
function addAWSRecipe(db, recipe) {

    // TODO: add check to see if recipe already exists
    const dataToSave = {};
    
    console.log('add or get ingredients');
    return addOrGetIngredients(recipe.ingredients, db)
        .then((ingredient_ids) => {

            console.log('Successfully got ingredient ids');
            dataToSave.ingredient_ids = ingredient_ids;

            console.log('Adding or retrieving category');
            return addOrGetCategory(recipe.category, db);
        })
        .then((category_id) => {

            dataToSave.category_id = category_id;
            return;
        })
        .then(() => {

            const recipeId = uuid();
            console.log('Creating recipe', recipeId);
            return db.collection('recipes').doc(recipeId).set({
                name: recipe.name,
                link: recipe.link,
                category: dataToSave.category_id,
                ingredients: dataToSave.ingredient_ids,
            });
        });
}

/**
 * Add category to db
 * @param {string} name
 * @returns {string} ID for the new category
 */
function createCategory(name, db) {
    
    const categoryId = uuid();
    console.log('Creating category', categoryId);
    return db.collection('categories').doc(categoryId).set({

        // convert to lowercase so we can guarantee a match when determining if a category already exists
        name: name.toLowerCase(),
    })
        .then(() => {

            console.log('Category added successfully', categoryId);
            return categoryId;
        });
}

/**
 * Adds a category to Firestore
 * If the category is already saved, does not add it again
 * @param {string} category_name
 * @param {Object} db Firestore client
 * @returns {string} The id of the new category, or the old id
 */
function addOrGetCategory(category_name, db) {
    
    console.log('check if category exists before adding');
    return doesCategoryExist(category_name, db)
        .then((exists) => {

            if (exists) {
                
                console.log('Category exists. Returning id', exists);
                return exists.id;
            }

            console.log('Category does not exist');
            return createCategory(category_name, db);
        });
}

function createIngredient(name, db) {
    
    const ingredientId = uuid();
    console.log('Creating ingredient', ingredientId);
    return db.collection('ingredients').doc(ingredientId).set({

        // convert to lowercase so we can guarantee a match when determining if a category already exists
        name: name.toLowerCase(),
    })
        .then(() => {

            console.log('Ingredient added successfully', ingredientId);
            return ingredientId;
        });
}

/**
 * Adds a ingredient to Firestore
 * If the ingredient is already saved, does not add it again
 * @param {string} category_name
 * @param {Object} db Firestore client
 * @returns {string} The id of the new category, or the old id
 */
function addOrGetIngredients(ingredients_list, db) {

    const ingredientIds = [];

    console.log('Creating chain of ingredient calls');
    return _.reduce(ingredients_list, (promise_chain, ingredient) => {

        return promise_chain
            .then(doesIngredientExist(ingredient, db))
            .then((exists) => {

                if (exists) {

                    console.log('Ingredient exists. Returning id', exists);
                    return exists.id;
                }

                console.log('Ingredient does not exist');
                return createIngredient(ingredient, db);
            })
            .then((id) => {

                console.log('Got ingredient', id);
                ingredientIds.push(id);
                return;
            });
    }, Promise.resolve())

        // return the ingredient ids so they can be added to the recipe
        .then(() => {

            console.log('returning ingredients', ingredientIds);
            return ingredientIds;
        });
}

/**
 * Determines if a category name is already in Firestore
 * @param {string} category_name
 * @param {Object} db Firestore client
 * @returns {string|null}
 */
function doesCategoryExist(category_name, db) {
    
    console.log('Checking if category exists');
    return db.collection('categories').where('name', '==', category_name).get()
        .then((query_snapshot) => {

            if (!query_snapshot.exists) return null;
            if (query_snapshot.size > 1) {

                console.error('More than one category has the same name', query_snapshot);
                throw new Error('More than one category has the same name');
            }

            return query_snapshot.docs()[0].id;
        });
}

/**
 * Determines if an ingredient is already in db
 * @param {string} ingredient_name
 * @param {Object} db
 * @returns {string|null}
 */
function doesIngredientExist(ingredient_name, db) {
    
    console.log('Checking if ingredient exists');
    return db.collection('ingredients').where('name', '==', ingredient_name).get()
        .then((query_snapshot) => {

            if (!query_snapshot.exists) return null;
            if (query_snapshot.size > 1) {

                console.error('More than one ingredient has the same name', query_snapshot);
                throw new Error('More than one ingredient has the same name');
            }

            return query_snapshot.docs()[0].id;
        });
}