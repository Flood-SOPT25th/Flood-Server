var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var group = require('../../model/group')
var jwt = require('../../module/jwt')
var statusCode = require('../../module/statusCode')
var authUtils = require('../../module/authUtils')

// 그룹 카테고리 조회
router.get('/',authUtils.LoggedIn, async (req, res, next) => {
    const userEmail = req.userEmail 
    try {
        let result = await user.findOne({email:userEmail}).select({groupCode: 1})
        let category = await group.findOne({groupCode : result.groupCode}).select({category : 1}) 
        res.status(200).json({
            message:"그룹 카테고리 조회 성공",
            data : {
                category : category.category
            }
        })
    } catch {
        res.status(500).json({
            message:"서버 에러"
        })
    }
})

module.exports = router;
