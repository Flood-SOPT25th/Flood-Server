var express = require('express');
var router = express.Router();
var post = require('../../model/post')
var user = require('../../model/user')
var comment = require('../../model/comment')
var authUtils = require('../../module/authUtils')
// var group = require('../../model/')

var statusCode = require('../../module/statusCode')


// 댓글 생성 # 완료
router.post('/', authUtils.LoggedIn, async (req, res, next) => {
    
    const { 
        commentContent, 
        post_id,
        comment_id 
    } = req.body

    if (!commentContent || !post_id) {
        res.status(409).json({
            message: "body값이 비어있습니다."
        })
    }

    let userEmail = req.userEmail
    let result = await user.findOne({email:userEmail}).select({name : 1, profileImage : 1})
    const {name, profileImage} = result
    console.log(profileImage)
    if (!comment_id) {
        let comments = new comment()
        comments.content = commentContent
        comments.writer = name
        comments.profileImage = profileImage

        let fin_comment = await comments.save()

        let postResult = await post.findOne({_id : post_id })

        if (!postResult) return res.status(410).json({message:"post_id에 맞는 결과가 없습니다."}) // 에러 처리


        postResult.comments.push(fin_comment._id)
        postResult.comments_count += 1
        let fin_post = await postResult.save().then(t => t.populate('comments').execPopulate()).catch((err) => {
            res.status(500).json({
                message:"post_id에 맞는 게시물이 없습니다."
            })
            return
        })
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
        let postResult = await post.findOne({_id : post_id }).populate('comments').catch((err) => {
            res.status(500).json({
                message:"post_id에 맞는 게시물이 없습니다."
            })
            return
        })
        res.status(200).json({
            message:"대댓글 달기 성공",
            data : {
                groupCode : postResult
            }
        })
    }

    
    
})

module.exports = router;
