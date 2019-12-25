var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload')
var post = require('../../model/post')
var statusCode = require('../../module/statusCode')


// 조회수
router.get('/', async (req, res, next) => {
    const post_id = req.query.post_id
    let postResult = await post.findOne({_id : post_id})
    postResult.see += 1
    postResult.score = (postResult.bookmark * 0.7 + postResult.see * 0.3)
    await postResult.save()
    res.status(statusCode.OK).json({
        message : "조회 성공",
        data : {

        }
    })
})

module.exports = router;
