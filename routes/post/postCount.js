var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload')
var post = require('../../model/post')
var statusCode = require('../../module/statusCode')


// 조회수
router.get('/', async (req, res, next) => {
    const post_id = req.query.post_id
    let result = await post.findOne({_id : post_id})
    result.see.push("gyg") // 유저 아이디 넣는곳
    let fin = await result.save()
    res.status(statusCode.OK).json({message : fin})
})

module.exports = router;
