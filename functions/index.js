const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const { listDb } = require('./src/controllers/listDb');
const { addRecipes } = require('./src/controllers/addRecipe');
const { action: loginAction, validate: loginValidate } = require('./src/controllers/login');

exports.listDb = functions.https.onRequest((req, res) => {

    cors(req, res, () => {

        console.log('Request received. Retrieving recipes');
        listDb()
            .then(data => {

                console.log('Responding with recipes.');
                return res.send(JSON.stringify(data));
            })
            .catch(e => {
                
                console.log('Failed to get recipes.', e);
                res.status(500).send(e.message);
                return;
            });
    });
});
exports.addRecipe = functions.https.onRequest((req, res) => {

    console.log('Request received. Validating input');
    if (!req.body || !req.body.recipe) {

        res.status(400).send({ status: 400, message: 'Error: missing recipe' });
        return;
    }
    
    console.log('Saving recipe', req.body.recipe);
    addRecipes([ req.body.recipe ])
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
    addRecipes(req.body.recipes)
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
 * Authenticates a user
 */
exports.login = functions.https.onRequest((req, res) => {

    // NOTE: The format of this function is a trial of the prototype mentioned below
    console.log('Request received. Validating input');
    try {
        
        loginValidate(req);
    } catch (e) {
        
        console.error(e);
        res.status(400).send({ status: 400, message: e.message });
        return;
    }

    loginAction(req)
        .then((token) => {

            console.log('Successfully logged in');
            res.send({ status: 200, message: 'Success', token });
            return;
        })
        .catch((e) => {
        
            console.error('Could not login', e);
            res.status(500).send({ status: 500, message: JSON.stringify(e.message) });
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