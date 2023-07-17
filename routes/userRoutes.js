const express = require('express');
const UserModel = require('../models/userModel');
const validator = require('../middlewares/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistModel = require('../models/blacklist');
const userRouter = express.Router();


userRouter.post('/register', validator ,async(req, res) => {
    const {password} = req.body;
    try {
        const newPass = await bcrypt.hash(password, 10);
        const user = await UserModel.create({...req.body, password : newPass});
        res.status(200).send({'msg' : 'User registered successfully', user});
    } catch (error) {
        res.status(400).send({'msg' : error.message});
    }
})

userRouter.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(400).send({'msg' : 'User not found'});
        }
        else{
            const verifiedPass = await bcrypt.compare(password, user.password);
            if(verifiedPass){
                const token = jwt.sign({userID : user._id}, process.env.secretKey, {expiresIn : '7d'});
                res.status(200).send({'msg' : 'User logged in successfully', token});
            }
            else{
                res.status(400).send({'msg' : 'Wrong Password'});
            }
        }
        
    } catch (error) {
        res.status(400).send({'msg' : error.message});
    }
})

userRouter.get('/logout', async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        if(!token){
            res.status(400).send({'msg' : 'Invalid token'});
        }
        else{
            const blackListedToken = await BlacklistModel.findOne({token});
            if(blackListedToken){
                res.status(400).send({'msg' : 'Please login first'})
            }
            else{
                const blacklistUser = await BlacklistModel.create({token});
                res.status(200).send({'msg' : 'User logged out successfully'});
            }
        }
          
    } catch (error) {
       res.status(400).send({'msg' : error.message});
    }
})

module.exports = userRouter;