const firebase = require('firebase');
const admin = require('firebase-admin');
const Joi = require('joi');
const { app } = require('../config.json');

module.exports = {
    action: action,
    validate: validate,
};

function action(req) {

    console.log('Initializing app');
    if (!firebase.apps.length) firebase.initializeApp(app);
    if (!admin.apps.length) admin.initializeApp(app);
    const { email, password } = req.body;
    console.log('Signing in with email and password');
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {

            console.log('Signed in with email and password. Generating session');
            return admin.auth().createCustomToken(result.user.uid);
        });
}

function validate(req) {

    if (!req.body) throw new Error('Body is missing');
    const { error } = Joi.validate({
        email: req.body.email,
        password: req.body.password,
    }, Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string(),
    }));
    if (error) throw new Error(error);
}