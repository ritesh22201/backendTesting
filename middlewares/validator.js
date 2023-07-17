const UserModel = require('../models/userModel');

const validator = async(req, res, next) => {
    const {email} = req.body;

    const existedUser = await UserModel.findOne({email});
    if(existedUser){
        return res.status(400).send('User already exists, please login')
    }

    next();

}

module.exports = validator;