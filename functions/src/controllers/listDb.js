const _ = require('lodash');

module.exports = {
    listDb: listDb,
}

/**
 * Takes a category id and returns its name
 */
function getCategoryName(db, id) {
    
    console.log('Loading category', id);
    return db.collection('categories')
        .doc(id)
        .get()
        .then(ref => ref.get('name'));
}

function getIngredientName(db, id) {
    
    console.log('Retrieving Ingredient name');
    return db.collection('ingredients')
        .doc(id)
        .get()
        .then(ref => ref.get('name'));
}

/**
 * Retrieves a list of ingredient names
 * @param {string[]} ingredients_list List of ingredient ids for the ingredient collection
 * @returns {string[]}
 */
function getIngredients(ingredients_list, db) {
    
    const ingredient_names = [];
    return _.reduce(ingredients_list, (promise_chain, ingredient) => {

        return promise_chain
            .then(() => getIngredientName(db, ingredient))
            .then((name) => ingredient_names.push(name));
    }, Promise.resolve())
        .then(() => ingredient_names);
}

/**
 * Returns data for the recipe from a Firestore reference object
 * @param {Object} recipe_ref Firestore reference to a specific recipe document
 * @param {Object} database Firestore interface
 * @returns {Recipe}
 */
function getRecipe(document_snapshot, db) {

    const data = {};

    console.log('Getting recipe', document_snapshot);
    return getCategoryName(db, document_snapshot.get('category'))
        .then(category => {

            console.log('Got category', category);
            data.category = category;

            console.log('Getting ingredients');
            return getIngredients(document_snapshot.get('ingredients'), db);
        })
        .then((ingredient_names) => {

            return {
                category: data.category,
                id: document_snapshot.id,
                ingredients: ingredient_names,
                link: document_snapshot.get('link'),
                name: document_snapshot.get('name'),
            };
        });
}

/**
 * @typedef {Object} Recipe
 * @prop {string} category
 * @prop {string} id
 * @prop {string[]} ingredients
 * @prop {string} link
 * @prop {string} name
 * @prop {string} notes
 */
function listDb(admin) {

    console.log('Request received. Loading db client.');
    const db = admin.firestore();

    console.log('Retrieve recipes.');
    return db.collection('recipes').listDocuments()
        .then(documents => {

            console.log('Got recipes reference. Loading documents.');
            return Promise.all(documents.map(document => document.get()));
        })
        .then(documentSnapshots => {

            console.log('Documents loaded. Parsing Recipes.');
            return Promise.all(documentSnapshots.map(document_snapshot => {

                console.log('Parsing', document_snapshot.id, document_snapshot.get('category'));
                return getRecipe(document_snapshot, db);
            }));
        });
}