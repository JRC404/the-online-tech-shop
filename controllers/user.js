const User = require("../models/user");
const jwt = require('jsonwebtoken'); //Generate signin token
const expressJwt = require('express-jwt'); //for auth check
const {errorHandler} = require("../helpers/dbErrorHandler");

//Signs user up
exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err){
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
};

exports.signin = (req, res) => {
    //Find user by email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) =>{
        if(err || !user){
            return res.status(400).json({
                err: "User with that email does not exist."
            })
        }
        //If user is found make sure email + password match
        //create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999});
        //return response with user and token to frontend client

        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});

    })
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Sign out success."});
}