var express = require('express');
var router = express.Router();

var user = require('../../model/user')

var authUtils = require('../../module/authUtils')
var statusCode = require('../../module/statusCode')

// 그룹 전체 맴버 조회 
router.get('/', authUtils.LoggedIn, async (req, res, next) => {

    const userEmail = req.userEmail

    try {
        let result = await user.findOne({
            email: userEmail
        }).select({_id: 0, groupCode: 1, admin: 1})

        if (result.admin == false) {
            res.status(401).json({
                message: "admin계정이 아닙니다.",
            })
            return
        }

        let admin = await user.find({
            groupCode: result.groupCode,
            admin: true
        }).select({
            name: 1,
            profileImage: 1,
            rank: 1,
            email: 1
        })
        let member = await user.find({
            groupCode: result.groupCode,
            admin: false
        }).select({
            name: 1,
            profileImage: 1,
            rank: 1,
            email: 1
        })

        let fin = {
            admin: admin,
            member: member
        }

        res.status(200).json({
            message: "그룹 멤버 정보 읽기 성공",
            data: {
                admin: fin.admin,
                member: fin.member
            }
        })
        return;

    } catch {
        res.status(500).json({
            message: "server error",
        })
        return
    }
})

//그룹 계정 삭제
router.put('/delete', authUtils.LoggedIn, async (req, res, next) => {
    
    const userEmail = req.userEmail
    const { member_email } = req.body

    try {
        const userIdx = await member_email.indexOf(userEmail)
        if (userIdx >= 0) {
            member_email.splice(userIdx,1)
        }    

        if (member_email.length < 1) {
            res.status(400).json({
                message: "삭제할 계정이 없습니다."
            })
            return
        }

        member_email.forEach(async function (email) {

            user.findOne({
                    email: email
                })
                .select({
                    name: 1,
                    profileImage: 1,
                    rank: 1,
                    groupCode: 1
                }) 
                .then((user) => {
                    user.groupCode = ""
                    user.save()
                })
        })
        res.status(200).json({
            message: "계정 삭제 완료",
            data: {
                user: member_email
            }
        })
        return;

    } catch {
        res.status(500).json({
            message: "server error",
        })
        return
    }
})

//그룹 계정 추가
router.put('/add', authUtils.LoggedIn, async (req, res, next) => {
    
    const userEmail = req.userEmail
    const { member_email } = req.body
 
    try {

        const userIdx = await member_email.indexOf(userEmail)
        if (userIdx >= 0) {
            member_email.splice(userIdx,1)
        }
    
        if (member_email.length < 1) {
            res.status(400).json({
                message: "추가할 계정이 없습니다."
            })
            return
        }

        member_email.forEach(async function (email) {

            user.findOne({
                    email: email
                })
                .select({
                    name: 1,
                    profileImage: 1,
                    rank: 1,
                    admin: 1
                })
                .then((user) => {
                    user.admin = true
                    user.save()
                })
        })
        res.status(200).json({
            message: "admin 계정 추가 완료",
            data: {
                user: member_email
            }
        })
        return;

    } catch {
        res.status(500).json({
            message: "server error",
        })
        return
    }
})


module.exports = router;