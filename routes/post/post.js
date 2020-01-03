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
    try {
        let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

        if (!codeResult) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리


        let result = await post.find({groupCode:codeResult.groupCode, url: { $ne: null }})
        
        if (!result) return res.status(410).json({message:"groupCode에 맞는 결과가 없습니다."}) // 에러 처리


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
    } catch (err) {
        res.status(500).json({
            message: `서버 에러: ${err}`
        })
    }
    
})

// 해당 게시물 조회 및 조회수 증가 # 완료
router.get('/detail/:idx', authUtils.LoggedIn, async (req,res,next) => {

    const idx = req.params.idx

    if (!idx) {
        res.status(400).json({
            message : "idx가 비어있습니다."
        })
        return
    }

    const userEmail = req.userEmail 
    try {
        let result = await post.findOne({_id : idx})
        result.see += 1
        result.score = (result.bookmark * 0.7 + result.see * 0.3)
        let fin_result = await result.save().then(t => t.populate('comments').execPopulate()).catch((err) => {
            res.status(500).json({
                message:"DB서버 에러",
            })
        })

        const count = fin_result.bookmark_list.findIndex(i => i == userEmail);

        if (count !== -1) {
            fin_result.bookmarked = true
        } else {
            fin_result.bookmarked = false
        }

        res.status(200).json({
            message: "해당 포스트 조회 성공",
            data: {
                pidArr : fin_result
            }
        })
    } catch {
        res.status(500).json({
            message: "서버 에러",
        })
    }
    
})

// 그룹의 전체 게시물 조회 # 완료
router.get('/', authUtils.LoggedIn, async (req,res,next) => {
    
    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    const userEmail = req.userEmail
    try {
        let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

        let result = await post.find({groupCode : codeResult.groupCode}).select({comments:0}).sort({"postDate":-1}).skip(Number(pageOptions.page)).limit(Number(pageOptions.limit))
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
    } catch {
        res.status(500).json({
            message: "서버 에러"
        })
    } 
   
})

// 그룹의 해시태그로 조회 #완료
router.get('/hash', authUtils.LoggedIn, async (req,res,next) => {
    
    const category = req.query.category
    
    if (!category) {
        res.status(409).json({
            message: "카테고리가 비어있습니다."
        })
    }

    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }
    console.log(pageOptions)
    const userEmail = req.userEmail 

    try {
        let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1})

    // 그룹 코드
        let result = await post.find({groupCode : codeResult.groupCode, category : category}).sort({"postDate":-1}).skip(Number(pageOptions.page)).limit(Number(pageOptions.limit))
        console.log("re")

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
    } catch (err) {
        res.status(500).json({
            message: `서버 에러: ${err}`
        })
    }
    

})

router.get('/me', authUtils.LoggedIn, async (req,res,next) => {
    

    var pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }

    const userEmail = req.userEmail 

    try {
        let result = await post.find({writer_email: userEmail}).sort({"postDate":-1}).skip(Number(pageOptions.page)).limit(Number(pageOptions.limit))

        res.status(200).json({
            message: "내가 쓴 글 피드 조회",
            data: {
                pidArr : result
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `서버 에러: ${err}`
        })
    }
    

})

// 게시물 업로드 # 완료
router.post('/', authUtils.LoggedIn, upload.array('images'),async function(req, res, next) {
    
    console.log(req.files)

    var param = {}

    let {
        url,
        category,
        postContent
    } = req.body

    if (!category) {
        res.status(409).json({
            message: "카테고리가 비어있습니다."
        })
    }

    const userEmail = req.userEmail 

    try {
        let codeResult = await user.findOne({email:userEmail}).select({groupCode: 1, name: 1, profileImage: 1, email:1})
        const postImages = req.files
        var posts = new post()
        if (url.length !== 0){
            client.fetch(url, param,function(err, $, re){ 

                if (err){  
                    res.status(500).json({
                        message: "크롤링 서버 에러",
                    })
                    return; 
                }
                
                const image = $("meta[property='og:image']").attr('content')
                const title = $("meta[property='og:title']").attr('content')
                const description = $("meta[property='og:description']").attr('content')
                
                if (image) {
                    posts.image = image
                } else {
                    posts.image = ''
                }
        
                if (title) {
                    posts.title = title
                } else {
                    posts.title = ''
                }
        
                if (description) {
                    posts.description = description
                } else {
                    posts.description = ''
                }
        
                posts.groupCode = codeResult.groupCode
                posts.category = category
                posts.writer = codeResult.name
                posts.writer_email = codeResult.email
                posts.postContent = postContent
                posts.profileImage = codeResult.profileImage
                posts.url = url
        
                postImages.forEach((n) => {
                    posts.postImages.push(n.location)
                })
                
                posts.save()
                .then((result) => {
                    res.status(200).json({
                        message: "게시물 업로드 완료",
                    })
                }) 
            });
        }else {
            posts.groupCode = codeResult.groupCode
            posts.category = category
            posts.writer = codeResult.name
            posts.writer_email = codeResult.email
            posts.postContent = postContent
            posts.profileImage = codeResult.profileImage
    
            postImages.forEach((n) => {
                posts.postImages.push(n.location)
            })

            posts.save()
            .then((result) => {
                res.status(200).json({
                    message: "게시물 업로드 완료",
                })
            }) 
        }
        
    } catch (err) {
        res.status(500).json({
            message: `서버 에러: ${err}`
        })
    }
  

});



module.exports = router;
