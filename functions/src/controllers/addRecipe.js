const uuid = require('uuid/v4');
const _ = require('lodash');

module.exports = {
    addRecipe: addRecipe,
    bulkAddRecipe: bulkAddRecipe,
}

/**
 * Takes a recipe object in AWS format and saves it to Firestore
 * @param {AWSRecipe} recipe
 */
function addAWSRecipe(db, recipe) {

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
 * Determines if a category name is already in Firestore
 * @param {string} category_name
 * @param {Object} db Firestore client
 * @returns {string|null}
 */
function doesCategoryExist(category_name, db) {
    
    const formattedName = category_name.toLowerCase();
    console.log('Checking if category exists', formattedName);
    return db.collection('categories')
        .where('name', '==', formattedName)
        .get()
        .then((query_snapshot) => {

            if (query_snapshot.size < 1) return null;
            if (query_snapshot.size > 1) {

                console.error('More than one category has the same name', query_snapshot.docs);
                throw new Error('More than one category has the same name');
            }

            console.log('Found category', query_snapshot.docs[0].id);
            return query_snapshot.docs[0].id;
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
                return exists;
            }

            console.log('Category does not exist', exists);
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
 * Determines if an ingredient is already in db
 * @param {string} ingredient_name
 * @param {Object} db
 * @returns {string|null}
 */
function doesIngredientExist(ingredient_name, db) {
    
    const formattedName = ingredient_name.toLowerCase();
    console.log('Checking if ingredient exists', formattedName);
    return db.collection('ingredients')
        .where('name', '==', formattedName)
        .get()
        .then((query_snapshot) => {

            if (query_snapshot.size < 1) return null;
            if (query_snapshot.size > 1) {

                console.error('More than one ingredient has the same name', query_snapshot.docs);
                throw new Error('More than one ingredient has the same name');
            }

            console.log('Found ingredient', query_snapshot.docs[0].id);
            return query_snapshot.docs[0].id;
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
            .then(() => doesIngredientExist(ingredient, db))
            .then((exists) => {

                if (exists) {

                    console.log('Ingredient exists. Returning id', exists);
                    return exists;
                }

                console.log('Ingredient does not exist', ingredient, exists);
                return createIngredient(ingredient, db);
            })
            .then((id) => {

                console.log('Got ingredient', ingredient, id);
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

function doesRecipeExist(recipe, db) {
    
    console.log('Checking if recipe exists');
    return db.collection('recipes')
        .where('name', '==', recipe.name)
        .where('link', '==', recipe.link)
        .get()
        .then((query_snapshot) => {

            if (query_snapshot.size < 1) return false;
            if (query_snapshot.size > 1) {
                
                console.error('More than one recipe has the same name and link', query_snapshot.docs);
                throw new Error('More than one recipe has the same name and link');
            }

            console.log('Found recipe', query_snapshot.docs[0].id);
            return true;
        });
}

function processRecipes(recipes, db) {
    
    return _.reduce(recipes, (promise_chain, recipe) => {

        return promise_chain
            .then(() => doesRecipeExist(recipe, db))
            .then((exists) => {

                if (exists) {

                    console.log('Recipe exists. Aborting', recipe);
                    throw new Error('Recipe exists');
                }

                console.log('Recipe does not exist. Creating now.');
                return addAWSRecipe(db, recipe);
            });
    }, Promise.resolve());
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

        console.log('Processing recipes');
        return processRecipes(recipes, db);
    } catch (e) {
        
        console.error('Failed to add recipe', e);
        return Promise.reject(e.message);
    }
}