var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var group = require('../../model/group')

var statusCode = require('../../module/statusCode')

// 그룹 코드 조회

router.get('/', async (req, res, next) => {
    console.log("ee")
    let userEmail = "ehdgns1766@naver.com"
    let result = await user.findOne({email:userEmail}).select({groupCode: 1})
    console.log(result)
    let category = await group.findOne({groupCode : result.groupCode}).select({category : 1}) 
    res.status(200).json({
        message:"그룹 코드 조회 성공",
        data : {
            category : category.category
        }
    })
})

module.exports = router;
