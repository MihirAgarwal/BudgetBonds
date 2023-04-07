require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.create_access_token = (payload)=>{

    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE
    });

    return accessToken;
}