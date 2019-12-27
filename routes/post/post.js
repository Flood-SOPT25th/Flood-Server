var express = require('express');
var router = express.Router();
var request = require('request');
var upload = require('../../module/awsUpload')
var client = require('cheerio-httpcli'); 
var user = require('../../model/user')
var post = require('../../model/post')
var statusCode = require('../../module/statusCode')
const formidable = require('express-formidable');
const multiparty = require('multiparty');
var authUtils = require('../../module/authUtils')

// 그룹의 top3 # 완료
router.get('/top', authUtils.LoggedIn ,async (req,res,next) => {

    const userEmail = req.userEmail 
    let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

    let result = await post.find({groupCode:codeResult.groupCode})
    
    result.sort((a, b) => { 
        return a.score < b.score ? 1 : a.score > b.score ? -1 : 0;  
    });

    let fin_result = result.slice(0,3)

    fin_result.forEach((n) => {
        let count = n.bookmark_list.findIndex(i => i == userEmail);
        if(count !== -1) {
            n.bookmarked = true
        }else {
            n.bookmarked = false  
        }
    })

    res.status(200).json({
        message: "top3 피드 조회 성공",
        data: {
            topArr : fin_result
        }
    })
})

// 해당 게시물 조회 및 조회수 증가 # 완료
router.get('/detail/:idx', authUtils.LoggedIn, async (req,res,next) => {

    const idx = req.params.idx
    // const userEmail = req.userEmail 
    // let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})
    let result = await post.findOne({_id : idx})
    result.see += 1
    result.score = (postResult.bookmark * 0.7 + postResult.see * 0.3)
    let fin_result = await result.save().then(t => t.populate('comments').execPopulate())

    res.status(200).json({
        message: "해당 포스트 조회 성공",
        data: {
            pidArr : fin_result
        }
    })
})

// 그룹의 전체 게시물 조회 # 완료
router.get('/', authUtils.LoggedIn, async (req,res,next) => {
    
    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    const userEmail = req.userEmail 
    let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

    let result = await post.find({groupCode : codeResult.groupCode}).select({comments:0}).skip(pageOptions.page).limit(pageOptions.limit)

    result.forEach((n) => {
        let count = n.bookmark_list.findIndex(i => i == userEmail);
        if(count !== -1) {
            n.bookmarked = true
        }else {
            n.bookmarked = false  
        }
    })

    res.status(200).json({
        message: "전체 피드 조회 성공",
        data: {
            pidArr : result
        }
    })
})

// 그룹의 해시태그로 조회 #완료
router.get('/hash', authUtils.LoggedIn, async (req,res,next) => {
    
    const category = req.query.category
    
    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    const userEmail = req.userEmail 
    let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

 // 그룹 코드
    let result = await post.find({groupCode : codeResult.groupCode, category : category}).skip(pageOptions.page).limit(pageOptions.limit)

    result.forEach((n) => {
        let count = n.bookmark_list.findIndex(i => i == userEmail);
        if(count !== -1) {
            n.bookmarked = true
        }else {
            n.bookmarked = false  
        }
    })

    res.status(200).json({
        message: "전체 피드 조회",
        data: {
            pidArr : result
        }
    })

})

// 게시물 업로드 # 완료
router.post('/', authUtils.LoggedIn, upload.array('images'),async function(req, res, next) {
    
    var param = {}

    let {
        url,
        category,
        postContent
    } = req.body

    const userEmail = req.userEmail 
    let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1, name: 1, profileImage: 1})

    const postImages = req.files

    client.fetch(url, param,function(err, $, re){ 
        var posts = new post()
        
        if (err){  
            res.status(500).json({
                message: "success",
                data: {}
            })
            return; 
        }
        
        const image = $("meta[property='og:image']").attr('content')
        const title = $("meta[property='og:title']").attr('content')
        const description = $("meta[property='og:description']").attr('content')

        if (image) {
            posts.image = image
        } 

        if (title) {
            posts.title = title
        }

        if (description) {
            posts.description = description
        }

        posts.groupCode = codeResult.groupCode
        posts.category = category
        posts.writer = codeResult.name
        posts.postContent = postContent
        posts.profileImage = codeResult.profileImage
        posts.url = url

        postImages.forEach((n) => {
            posts.postImages.push(n.location)
        })
        
        posts.save()
        .then((result) => {
            res.json({message:result})
        }) 
    });

});



module.exports = router;
