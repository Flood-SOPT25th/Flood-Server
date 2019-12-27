var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload')
var post = require('../../model/post')
var statusCode = require('../../module/statusCode')
var group = require('../../model/group')
var user = require('../../model/user')
var authUtils = require('../../module/authUtils')

// 북마크 조회 
router.get('/', authUtils.LoggedIn, async (req, res, next) => {

    const userEmail = req.userEmail // decode info
    
    let result = await user.findOne({email : userEmail}).populate('bookmark.post').select({bookmark:1})
    let arr = []
    let allCount = 0 
    result.bookmark.forEach((n) => {
        var wrap = {}
        wrap.category_id = n._id
        wrap.categoryName = n.categoryName
        if (n.post[0]) {
            wrap.thumb = n.post[0].image
            wrap.count = n.post.length
            allCount += n.post.length
        }else {
            wrap.thumb = ""
            wrap.count = 0
        }
        arr.push(wrap)
    })

    const allwrap = {
        categoryName: "all",
        thumb : "",
        count : allCount
    } 
    arr.unshift(allwrap)

    res.status(200).json({
        message : "북마크 조회 완료",
        data: {
            categorys : arr 
        }
    })
})


// 해당 북마크 조회
router.get('/list', async (req, res, next) => {

    const category = req.query.category
    console.log(category)
    const userEmail = "ehdgns1766@naver.com" // decode info

    let result = await user.findOne({email : userEmail}).populate('bookmark.post').select({bookmark:1})
    if (category == "all") {
        var arr = []
        result.bookmark.forEach((n) => {
            arr = arr.concat(n.post)
            console.log(arr)
        })
        res.status(200).json({
            message:"해당 북마크 조회 완료",
            data:{
                posts: arr
            }
        })
    } else {
        const count = result.bookmark.findIndex(i => i.categoryName == category); 

        res.status(200).json({
            message:"해당 북마크 조회 완료",
            data:{
                posts: result.bookmark[count].post
            }
        })
    }
})

// {
// 	add:["it"],
// 	update[[_id,변경후],[_id,변경후]],
// 	delete:[_id,_id]
// }

// 카테고리 생성 개발해야함
router.post('/', async (req, res, next) => {
    const categoryName = "ui/ux"
    const categoryObejct = req.body.categoryObejct
    // const categoryArr = req.body.categoryArr
    const userEmail = "ehdgns1766@naver.com" // decode info

    let result = await user.findOne({email : userEmail})
    
    if (categoryObejct.add.length !== 0) {

    }

    if (categoryObejct.update.length !== 0) {

    }

    if (categoryObejct.delete.length !== 0) {
        
    }

    const count = result.bookmark.findIndex(i => i.categoryName === categoryName); 

    if (count == -1) {
        let wrap = {}
        wrap.categoryName = categoryName
        wrap.post = []
        result.bookmark.unshift(wrap)
        await result.save()
        res.status(200).json({
            message:"카테고리 생성",
            data:{

            }
        })
        return
    } else{
        res.status(409).json({
            message:"카테고리 이름 중복",
            data:{

            }
        })
        return
    }
})

// 북마크 추가

router.post('/add', async (req, res, next) => {
    const userEmail = "ehdgns1766@naver.com"
    const {post_id,category_id} = req.body

    let postResult = await post.findOne({_id : post_id})
    postResult.bookmark += 1
    postResult.score = (postResult.bookmark * 0.7 + postResult.bookmark * 0.3) 
    await postResult.save()  // 북마크 수 증가

    let result = await user.findOne({email : userEmail})
    const count = result.bookmark.findIndex(i => i._id == category_id); 
    if (count !== -1) {
        result.bookmark[count].post.unshift(post_id)
        await result.save()
        res.status(200).json({
            message: "북마크 추가완료",
            data : {

            }
        })
    }
})

// 북마크 취소
router.post('/cancle', async (req, res, next) => {
    const {post_id} = req.body
    const userEmail = "ehdgns1766@naver.com" // decode info

    let postResult = await post.findOne({_id:post_id})
    postResult.bookmark -= 1
    postResult.score = (postResult.bookmark * 0.7 + postResult.bookmark * 0.3) 
    await postResult.save()  // 북마크 수 감소
    
    let result = await user.findOne({email : userEmail})

    for (let n of result.bookmark) {
        const count = n.post.findIndex(i => i == post_id); 
        if(count !== -1){
            n.post.splice(count,1)
            break
        }   
    }
    
    await result.save()
    res.status(200).json({
        message: "북마크 취소",
        data: {

        }
    })

    // result.bookmark.forEach((n) => {
    //     const count = n.post.findIndex(i => i == post_id); 
    //     if(count !== -1){
    //         n.post.splice(count,1)
    //         break
    //     }else{
    //         console.log("못찾았다")
    //     }
    // })
    

})



// router.post('/add', async (req,res,next) => {

//     const userEmail = "ehdgns1766@naver.com" // decode info

//     const {post_id,image,category_id} = req.body

//     let postResult = await post.findOne({_id:post_id})
//     postResult.bookmark += 1
//     await post.save()  // 북마크 수 증가

//     let result = await user.findOne({email : userEmail})
//     let postWrap = {}

//     result.category.forEach((n) => {
//         if (n.categoryName === bookmarkCategory) {
//             n.thumb.unshift(image)
//             if (n.thumb.length >= 5) {
//                 n.thumb.length = 4
//             }
//         }
//     })

//     postWrap.post = post_id
//     postWrap.category = bookmarkCategory
//     result.bookmark.unshift(postWrap)
//     result.save()
//     .then((re) => {
//         res.status(200).json({
//             message: `${bookmarkCategory}에 저장 완료`,
//             data:{
//                 post:re
//             }
//         })
//     })
// })


module.exports = router;
