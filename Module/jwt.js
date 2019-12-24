const randToken = require('./node_modules/rand-token');
const jwt = require('./node_modules/jsonwebtoken');
const {secretOrPrivateKey} = require('../config/secretKey');
const options = {
    algorithm:"HS256",
    expiresIn:"7d",
    issuer:"Flood"
};
module.exports ={
    sign:(user) =>{
        const payload = {
            email:user.email,
            name:user.name,
            group:user.group
        };
        const result = {
            token:jwt.sign(payload, secretOrPrivateKey, options),
            refreshToken:randToken.uid(256)
        };
        return result;

    },
    verify:(token) =>{
        let decoded;
    try{
        decoded = jwt.verify(token,secretOrPrivateKey);
    } catch(err){
        if(err.message === 'jwt expired'){
            console.log('expired token');
            return -2;
        }else if(err.message === 'invalid token') {
            console.log("invalid token");
            return -2;
        } else{
            console.log("invalid token");
            return -2;
        }
    }
    return decoded;
    },
    refresh:(user) =>{
        const payload = {
            idx:user.idx,
            grade:user.grade,
            name:user.name
        };
        return jwt.sign(payload,secretOrPrivateKey, options);
    }
}