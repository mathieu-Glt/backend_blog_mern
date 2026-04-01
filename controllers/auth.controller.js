const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports.signUp = async (req, res, next) => {
    console.log("🚀 ~ file: auth.controller.js:5 ~ module.exports.signUp= ~ req:", req)
    console.log("🚀 ~ file: auth.controller.js:6 ~ module.exports.signUp= ~ req:", req.body)
    const { pseudo, email, password } = req.body;


    try {
        const user = await UserModel.create({ pseudo, email, password });
        console.log("🚀 ~ file: auth.controller.js:12 ~ module.exports.signUp= ~ user:", user)
            res.status(201).json({ status: 201, message: "user has been registered", user: user });
    } catch (error) {
        console.log("🚀 ~ file: auth.controller.js:13 ~ module.exports.signUp= ~ error:", error)
        const errors = signUpErrors(error)
        res.status(400).json({ errors: errors })

        // Gestion des erreurs spécifiques
        // if(error.code === 11000) {
        //     if(error.keyPattern && error.keyPattern.email){
        //     res.status(400).json({ status: 400, message: "Email already exists", error: error.message });

        //     }
        //     if(error.keyPattern && error.keyPattern.pseudo) {
        //         res.status(400).json({ status: 400, message: "Pseudo already exists", error: error.message });

        //     }

        // } else {
          // Autre erreur interne du serveur
        //   res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });

        // }
        
    }
}


module.exports.test = async (req, res, next) => {

    try {
        res.status(200).json({ status: 200, message: "Welcome to application mern project !" });
    } catch (error) {
        console.log("🚀 ~ file: auth.controller.js:13 ~ module.exports.signUp= ~ error:", error)
        res.status(400).json({ status: 400, errors: error })

        
    }
}


module.exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(200).json({ status: 200, message: "successfully connected", user: user })
    } catch (error) {
        console.log("🚀 ~ file: auth.controller.js:51 ~ module.exports.signIn= ~ error:", error)
        const errors = signInErrors(error)
        res.status(400).json({ errors: errors })


    }
}


module.exports.logout = (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}