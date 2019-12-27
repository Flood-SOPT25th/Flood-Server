var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var group = require('../../model/group')
var authUtils = require('../../module/authUtils')
var statusCode = require('../../module/statusCode')


// upload 버튼 눌렀을 때
// 그룹 전체 맴버 조회
router.get('/',authUtils.LoggedIn, async (req, res, next) => {
    const userEmail = req.userEmail 
    let result = await user.findOne({email:userEmail}).select({groupCode:1})
    const groupCode = result.groupCode
    let category = await group.findOne({groupCode:groupCode}).select({category:1}) // 카테고리 array

    user.find({groupCode: groupCode}).select({name: 1, profileImage:1})
        .then((result) => {
            console.log(result)
            res.status(statusCode.OK).json({
                message: "그룹에 있는 사람들 all",
                data : {
                    category : category,
                    member : result
                }
            })
        })
})

module.exports = router;
