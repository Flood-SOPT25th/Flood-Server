const crypto = require('crypto');
module.exports ={
    makeCrypto: (password, salt) =>{
        const key = crypto.pbkdf2Sync(password, salt, 112129, 64, 'sha512');
        return key;
    },
    salt:() =>{
        const buf = crypto.randomBytes(64);
        const salt = buf.toString('base64');
        return salt;
    }
}