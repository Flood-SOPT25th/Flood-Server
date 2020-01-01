var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var group = require('../../model/group')
var authUtils = require('../../module/authUtils')
var statusCode = require('../../module/statusCode')

// 그룹 정보 Array
router.get('/',authUtils.LoggedIn, async (req, res, next) => {

    // const userEmail = req.userEmail 
    
    let result = await group.find({})

    res.status(200).json({
        message:"그룹 리스트",
        data : {
            groupArr : result
        }
    })
})

// 그룹 정보 info
router.get('/:groupCode',authUtils.LoggedIn, async (req, res, next) => {

    const groupCode = req.params.groupCode

    let groupResult = await group.findOne({groupCode:groupCode})

    // let firstCategory = groupResult.category[0]

    res.status(200).json({
        message:"그룹에 대한 정보",
        data : {
            groupInfo: groupResult,
        }
    })
})


// 그룹 게시물 통신 
router.get('/:groupCode/:category',authUtils.LoggedIn, async (req, res, next) => {

    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    const groupCode = req.params.groupCode
    const category = req.params.category

    // let firstCategory = groupResult.category[0]

    let result = await post.find({groupCode:groupCode, category:category}).select({comments:0}).skip(Number(pageOptions.page)).limit(Number(pageOptions.limit))

    res.status(200).json({
        message:"그룹에 대한 게시물",
        data : {
            groupArr : result
        }
    })
})


module.exports = router;
