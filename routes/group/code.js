var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
// var group = require('../../model/')
var authUtils = require('../../module/authUtils')
var statusCode = require('../../module/statusCode')


// 그룹 코드 조회 #완료 

router.get('/',authUtils.LoggedIn , async (req, res, next) => {
    const userEmail = req.userEmail 
    let result = await user.findOne({email:userEmail}).select({groupCode:1})
    res.status(200).json({
        message:"그룹 코드 조회 성공",
        data : {
            groupCode : result.groupCode
        }
    })
})

module.exports = router;
