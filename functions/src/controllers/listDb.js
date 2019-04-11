/**
 * @typedef {Object} Recipe
 * @prop {string} category
 * @prop {string} id
 * @prop {string[]} ingredients
 * @prop {string} link
 * @prop {string} name
 * @prop {string} notes
 */
exports.listDb = (admin) => {

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
            return documentSnapshots.forEach(document_snapshot => {

                console.log('Parsing', document_snapshot.id, document_snapshot.get('category'));
                return exports.getRecipe(document_snapshot, db);
            });
            // return Promise.all(documentSnapshots.map(snapshot => getRecipe(snapshot, db)));
        });
};

/**
 * Returns data for the recipe from a Firestore reference object
 * @param {Object} recipe_ref Firestore reference to a specific recipe document
 * @param {Object} database Firestore interface
 * @returns {Recipe}
 */
exports.getRecipe = (recipe_ref, database) => {

    return recipe_ref.get()
        .then(document_snapshot => {

            return exports.getCategoryName(database, document_snapshot.get('category'));
        })
        .then(category => {

                return {
                    category,
                    id: snapshot.id,
                    link: snapshot.get('link'),
                    name: snapshot.get('name'),
                    notes: snapshot.get('notes'),
                };
        });
};

/**
 * Takes a category id and returns its name
 */
exports.getCategoryName = (db, id) => {
    
    console.log('Loading category', id);
    return db.collection('categories').doc(id).get().then(ref => ref.get('name'));
};