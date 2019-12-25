var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload')
var client = require('cheerio-httpcli'); 
var post = require('../../model/post');
var statusCode = require('../../module/statusCode')
const formidable = require('express-formidable');
const multiparty = require('multiparty');


// router.use('/', (req,res,next) => {
//     var form = new multiparty.Form();
//     form.parse(req, function(err, fields, files) {
//         if (files) {
//             upload.array('images')
//         }else {
//             upload.none('ima')
//         }
//         console.log(files)
//     });
//     next()
// })



// 그룹의 전체 게시물 조회
router.get('/', async (req,res,next) => {
    
    const groupCode = "1234" // 그룹 코드
    let result = await post.find({groupCode:groupCode})
    const pid = result.slice()

    result.sort((a, b) => { 
        return a.score < b.score ? 1 : a.score > b.score ? -1 : 0;  
    });

    res.status(200).json({
        message: "전체 피드 조회",
        data: {
            topArr : result.slice(0,3),
            pidArr : pid
        }
    })
    console.log(pid)
})

// 그룹의 해시태그로 조회
router.get('/hash', async (req,res,next) => {
    const category = req.query.category

    const groupCode = "1234" // 그룹 코드
    let result = await post.find({groupCode : groupCode, category : category})

    res.status(200).json({
        message: "전체 피드 조회",
        data: {
            pidArr : result
        }
    })

})

router.post('/',upload.array('images'),async function(req, res, next) {
    
    var param = {}

    let {
        url,
        category,
        postContent
    } = req.body

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

        posts.groupCode = "dqweqwedqw"
        posts.category = category
        posts.writer = "ehdgns1766"
        posts.postContent = postContent
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
