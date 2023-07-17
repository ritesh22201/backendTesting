const BlacklistModel = require("../models/blacklist");
const jwt = require('jsonwebtoken');

const auth = async(req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(400).send({'msg' : 'Invalid token'});
    }

    const blacklistedUser = await BlacklistModel.findOne({token});
    if(blacklistedUser){
        return res.status(400).send({'msg' : 'Token revoked, login again'});
    }

    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if(decoded){
            req.body.userID = decoded.userID;
            next();
        }
        else{
            res.status(400).send({'msg' : 'Wrong token provided'});
        }
    })

}

module.exports = auth;