const firebase = require('firebase');
const Joi = require('joi');

module.exports = {
    action: action,
    validate: validate,
};

function action(req) {

    const { email, password } = req.body;
    return firebase.auth().signInWithEmailAndPassword(email, password);
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