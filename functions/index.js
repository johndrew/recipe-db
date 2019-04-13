const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { listDb } = require('./src/controllers/listDb');
const { addRecipes } = require('./src/controllers/addRecipe');

// TODO: create a config file that each call like this can inject
admin.initializeApp();

exports.listDb = functions.https.onRequest((req, res) => {

    console.log('Request received. Retrieving recipes');
    listDb(admin)
        .then(data => {

            console.log('Responding with recipes.');
            return res.send(data);
        })
        .catch(e => {
            
            console.log('Failed to get recipes.', e);
            res.status(500).send(e.message);
            return;
        });
});
exports.addRecipe = functions.https.onRequest((req, res) => {

    console.log('Request received. Validating input');
    if (!req.body || !req.body.recipe) {

        res.status(400).send({ status: 400, message: 'Error: missing recipe' });
        return;
    }
    
    console.log('Saving recipe', req.body.recipe);
    addRecipes([ req.body.recipe ], admin)
        .then(() => {
            
            res.send({ status: 200, message: 'success' });
            return;
        })
        .catch((err) => {

            res.status(500).send({ status: 500, message: err.message });
            return;
        });
});
exports.bulkAddRecipe = functions.https.onRequest((req, res) => {

    console.log('Request received. Validating input');
    if (!req.body || !req.body.recipes || !req.body.recipes.length) {

        res.status(400).send({ status: 400, message: 'Error: missing recipes' });
        return;
    }

    console.log('Bulk savings recipes', req.body.recipes);
    addRecipes(req.body.recipes, admin)
        .then(() => {

            res.send({ status: 200, message: 'success' });
            return;
        })
        .catch((err) => {

            res.status(500).send({ status: 500, message: err.message });
            return;
        });
});

/**
 * PROTOTYPE: Express-like controller setup
 * 
 * Given a directory of JS files, each which exports a <name> and a <middleware> function,
 * creates a firebase http function such that <name> is the exports name and <middleware is called by functions.https.onRequest.
 * 
 * Each middleware must accept the http request and response objects.
 * 
 * pseudo-code:
 * for each file in controllers directory:
 *  - require the name/middleware function for each
 *  - create an exports line where name is the exports name and middleware function is injected into onRequest function
 */