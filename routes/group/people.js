var express = require('express');
var router = express.Router();
var post = require('../../model/post')
// var group = require('../../model/')

var statusCode = require('../../module/statusCode.json')


// upload 버튼 눌렀을 때

router.post('/', async (req, res, next) => {

    const groupCode = "qweqwe"

    let category = await group.findOne({groupCode:groupCode}).select({category:1}) // 카테고리 array

    user.find({groupCode: groupCode}).select({name: 1, profileImage:1})
        .then((result) => {
            console.log(result)
            res.status(statusCode.OK).json({
                message: "그룹에 있는 사람들 all",
                data : {
                    category : category,
                    member : result
                }
            })
        })
})

module.exports = router;
