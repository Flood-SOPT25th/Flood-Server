var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
// var group = require('../../model/')

var statusCode = require('../../module/statusCode')


// 그룹 코드 조회

router.get('/', async (req, res, next) => {
    // const groupCode = req.groupCode
    let userEmail = "ehdgns1766@naver.com"
    let result = await user.findOne({email:userEmail}).select({groupCode:1})
    res.status(200).json({
        message:"그룹 코드 조회 성공",
        data : {
            groupCode : result.groupCode
        }
    })
})

module.exports = router;
