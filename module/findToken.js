const users = require('../model/user');
const jwt = require('./jwt');

module.exports ={
    searchRefreshToken: async (refreshToken) =>{
        try{
            const result = await users.findOne({refreshToken:refreshToken}, {_id:0,email:1,name:1});
            if(!result){
                res.status(409).json({
                    message:"존재하지 않는 refresh token."
                })
                return;
            }
            return jwt.refresh(result);
        }catch(err){
            if(err){
                res.status(500).json({
                    message:"refresh token error."
                })
                return;
            }
        }
    }
}