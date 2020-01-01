var express = require('express');
var router = express.Router();
var request = require('request')
var upload = require('../../module/awsUpload')
var post = require('../../model/post')
var statusCode = require('../../module/statusCode')
var group = require('../../model/group')
var user = require('../../model/user')
var authUtils = require('../../module/authUtils')

// 북마크 조회 # 완료
router.get('/', authUtils.LoggedIn, async (req, res, next) => {

    const userEmail = req.userEmail // decode info
    
    let result = await user.findOne({email : userEmail}).populate('bookmark.post').select({bookmark:1})

    if (!result) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리

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

// 해당 북마크 조회 # 완료 # 수정해야 할 수도
router.get('/detail', authUtils.LoggedIn, async (req, res, next) => {

    const category = req.query.category

    if (!category) {
        res.status(400).json({
            message : "카테고리 정보가 없습니다."
        })
        return
    }

    const userEmail = req.userEmail // decode info

    let result = await user.findOne({email : userEmail}).populate('bookmark.post').select({bookmark:1})

    if (!result) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리

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
        return
    } else {
        const count = result.bookmark.findIndex(i => i.categoryName == category); 
        if (count !== -1) {
            res.status(200).json({
                message:"해당 북마크 조회 완료",
                data:{
                    posts: result.bookmark[count].post
                }
            })
            return
        } else {
            res.status(409).json({
                message:"카테고리명이 정확하지 않습니다."
            })
            return
        }
        
    }
})

// {
// 	add:["it"],
// 	update[[_id,변경후],[_id,변경후]],
// 	delete:[_id,_id]
// }

// 카테고리 생성 수정 삭제 # 완료 # 에러 ㄴ핸들링
router.post('/', authUtils.LoggedIn, async (req, res, next) => {
    const categoryObejct = req.body.categoryObejct

    if (!categoryObejct) {
        res.status(400).json({
            message: "category 정보가 없습니다."
        })
        return
    }

    const userEmail = req.userEmail // decode info
    let result_message = ""
    try {
        let result = await user.findOne({email : userEmail})

        if (!result) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리

        let message_count
        if (categoryObejct.add.length !== 0) {
            message_count = 0
            categoryObejct.add.forEach((n) => {
                const count = result.bookmark.findIndex(i => i.categoryName == n); 
                if (count == -1) {
                    let wrap = {}
                    wrap.categoryName = n
                    wrap.post = []
                    result.bookmark.unshift(wrap)
                    message_count +=1
                }
            })
            if (message_count > 0){
                result_message += "수정"
            }
        }

        if (categoryObejct.update.length !== 0) {
            message_count = 0
            categoryObejct.update.forEach((n) => {
                const count = result.bookmark.findIndex(i => i._id == n[0]);
                if (count !== -1){
                    result.bookmark[count].categoryName = n[1]
                    message_count +=1
                }
            })
            if (message_count > 0){
                result_message += " 수정"
            }
        }

        if (categoryObejct.delete.length !== 0) {
            message_count = 0
            categoryObejct.delete.forEach((n) => {
                const count = result.bookmark.findIndex(i => i._id == n);
                if (count !== -1){
                    console.log(count)
                    result.bookmark.splice(count,1)
                    message_count +=1
                }
            })
            if (message_count > 0){
                result_message += " 삭제"
            }
        }
    
        const rere = await result.save()

        res.status(200).json({
            message: `카테고리 ${result_message} 완료`,
            data: rere
        })
    } catch (err) {
        res.status(500).json({
            message: `서버 에러: ${err}`
        })
    }
})

// 북마크 추가 # 완료 # 에러 핸들링
router.post('/add', authUtils.LoggedIn, async (req, res, next) => {
    
    const userEmail = req.userEmail
    const {post_id,category_id} = req.body

    if (!post_id || !category_id) {
        res.status(400).json({
            message : "body가 비어 있습니다."
        })
    }
    try {
        let postResult = await post.findOne({_id : post_id})
        
        if (!postResult) return res.status(410).json({message:"post_id에 맞는 게시물이 없습니다."}) // 에러 처리
        
        postResult.bookmark += 1
        let arr = postResult.bookmark_list
        arr.push(userEmail)
        postResult.bookmark_list = Array.from(new Set(arr))
        postResult.score = (postResult.bookmark * 0.7 + postResult.bookmark * 0.3) 
        await postResult.save()  // 북마크 수 증가
        let result = await user.findOne({email : userEmail})

        if (!result) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리

        const count = result.bookmark.findIndex(i => i._id == category_id); 
        if (count !== -1) {
            result.bookmark[count].post.unshift(post_id)
            await result.save()
            res.status(200).json({
                message: "북마크 추가완료"
            })
        }
    } catch {
        res.status(500).json({
            message : "서버 에러"
        })
    }
    
})

// 북마크 취소 #완료 # 에러핸들링
router.post('/cancel', authUtils.LoggedIn, async (req, res, next) => {
    const {post_id} = req.body

    if (!post_id) {
        res.status(400).json({
            message : "post_id가 비어있습니다."
        })
    }

    try {
        const userEmail = req.userEmail // decode info

        let postResult = await post.findOne({_id:post_id})

        if (!postResult) return res.status(410).json({message:"post_id에 맞는 게시물이 없습니다."}) // 에러 처리

        postResult.bookmark -= 1
        let arr = postResult.bookmark_list
        arr.splice(arr.indexOf(userEmail),1)
        postResult.bookmark_list =arr
        postResult.score = (postResult.bookmark * 0.7 + postResult.bookmark * 0.3) 
        await postResult.save()  // 북마크 수 감소
        
        let result = await user.findOne({email : userEmail})

        if (!result) return res.status(410).json({message:"userEmail에 맞는 결과가 없습니다."}) // 에러 처리


        for (let n of result.bookmark) {
            const count = n.post.findIndex(i => i == post_id); 
            if(count !== -1){
                n.post.splice(count,1)
                break
            }   
        }
        
        await result.save()
        res.status(200).json({
            message: "북마크 취소"
        })
    } catch (err) {
        res.status(500).json({
            message : `서버 에러: ${err}`
        })
    }
})


module.exports = router;
