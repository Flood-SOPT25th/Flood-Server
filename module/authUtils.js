const jwt = require('./jwt')
const statusCode = require('./statusCode')
const user = require('../model/user');
//const findToken = require('./findToken')

module.exports = {
    LoggedIn: async (req, res, next) => {
        const token = req.headers.authorization
        //const refreshToken = req.headers.authorization
        if (!token) {
            res.status(409).json({
                message: "토큰 없음"
            })
        } else {
            result = jwt.verify(token);
            console.log(result)
            /*if(refreshToken && result == -1){
                result = jwt.verify(findToken.searchRefreshToken(refreshToken))
                console.log('토큰 재생성'+result);
            }*/
            if (result == -1) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    message:"만료된 토큰입니다."
                })
            }
            if (result == -2) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    message:"유효하지 않은 토큰입니다."
                })
            }
            if (result == -3) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    message:"만료된 토큰입니다."
                })
            }
            const userEmail = result.email
            console.log(userEmail)
            if (!userEmail) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    message:"유효하지 않은 토큰입니다."
                })
            } else {
                req.userEmail = userEmail
                req.decoded = result
                next()
            }
        }
        
    }
}