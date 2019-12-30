var express = require('express');
var router = express.Router();
var group = require('../../model/group')
var user = require('../../model/user')
var post = require('../../model/post')

var authUtils = require('../../module/authUtils')
var statusCode = require('../../module/statusCode')

// 메인 정보
router.get('/', authUtils.LoggedIn, async (req, res, next) => {
    const userEmail = req.userEmail
    
    let userResult = await user.findOne({email : userEmail}).select({name: 1, profileImage: 1, groupCode: 1, rank: 1})
 
    let groupResult = await group.findOne({groupCode: userResult.groupCode}).select({name:1, department: 1})

    let postResult = await post.find({writer_email : userEmail}).select({_id:1})

    let count = postResult.length
    
    res.status(200).json({
        message: "프로필 메인 조회 완료",
        data :{
            userInfo:{
                name : userResult.name,
                profileImage : userResult.profileImage,
                rank : userResult.rank,
                groupName : groupResult.name,
                groupDepartment : groupResult.department,
                count : count        
            }
        }
    })
})


module.exports = router;