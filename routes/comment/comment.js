var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var comment = require('../../model/comment')

// var group = require('../../model/')

var statusCode = require('../../module/statusCode')


// 댓글 생성

router.post('/', async (req, res, next) => {
    
    const { 
        commentContent, 
        post_id,
        comment_id 
    } = req.body
    let userEmail = "ehdgns1766@naver.com"
    let result = await user.findOne({email:userEmail}).select({name : 1, profileImage : 1})
    const {name, profileImage} = result


    if (!comment_id) {
        let comments = new comment()
        comments.content = commentContent
        comments.writer = name
        comments.profileImage = profileImage

        let fin_comment = await comments.save()

        let postResult = await post.findOne({_id : post_id })
        postResult.comments.push(fin_comment._id)
        let fin_post = await postResult.save().then(t => t.populate('comments').execPopulate())
        res.status(200).json({
            message:"댓글 달기 성공",
            data : {
                groupCode : fin_post
            }
        })
    } else {
        let commentResult = await comment.findOne({_id : comment_id})

        let comments = new comment()
        comments.content = commentContent
        comments.writer = name
        comments.profileImage = profileImage

        commentResult.subComment.push(comments)
        commentResult.save()
        let postResult = await post.findOne({_id : post_id }).populate('comments')
        res.status(200).json({
            message:"대 댓글 달기 성공",
            data : {
                groupCode : postResult
            }
        })
    }

    
    
})

module.exports = router;
