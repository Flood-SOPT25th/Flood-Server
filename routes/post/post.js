var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload.json')
var client = require('cheerio-httpcli'); 
var post = require('../../model/post')
var statusCode = require('../../module/statusCode.json')
const formidable = require('express-formidable');
const multiparty = require('multiparty')


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

router.post('/',upload.array('images'),async function(req, res, next) {
    
    var param = {}

    let {
        url,
        // postTitle,
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

        posts.writer = "ehdgns1766"
        posts.postTitle = postTitle
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
