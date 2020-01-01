var express = require('express');
var router = express.Router();
var authUtils = require('../../module/authUtils')
var encryption = require('../../module/encryption');
var upload = require('../../module/awsUpload');
var groups = require("../../model/group");
var users = require("../../model/user");
const jwt = require('../../module/jwt');

//프로필 설정 화면
router.get('/', authUtils.LoggedIn, async function (req, res, next) {

    try{
    const userEmail = req.userEmail
    var user = await users.findOne({
        email: userEmail
    }, {
        _id: 0,
        name: 1,
        rank: 1,
        email: 1,
        phone: 1,
        groupCode: 1,
        profileImage: 1,
        admin: 1
    })

    if (!user) return res.status(403).json({
        message: "존재하지 않는 사용자 입니다."
    })

    const result = await groups.findOne({
        groupCode: user['groupCode']
    }, {
        _id: 0,
        name: 1
    })
    let fin = {
        group: result,
        user: user
    }

    res.status(200).json({
        message: "사용자 정보 읽기 성공",
        data: {
            user: fin.user,
            group: fin.group,
        }
    })
    console.log("사용자 정보 읽기 성공");
    return;
    
}catch(err){
    res.status(500).json({
        message: "server error"
    })
    return;
}
})


//프로필 정보 업데이트
router.put('/', authUtils.LoggedIn, async function (req, res, next) {

    const userEmail = req.userEmail

    const {
        name,
        rank,
        phone,
        profileImage
    } = req.body

    if (!name || !rank || !phone) {
        const missParameters = Object.entries({
                name,
                rank,
                phone
            })
            .filter(it => it[1] == undefined).map(it => it[0]).join(', ');

        const errData = {
            message: `필요한 정보를 모두 입력하세요.`
            // data: `${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    try {
        var user = await users.findOne({
            email: userEmail
        })
        if (!user) return res.status(403).json({
            message: "존재하지 않는 사용자입니다. "
        })
        user.name = name
        user.rank = rank
        user.phone = phone
        user.profileImage = profileImage

        var output = await user.save();
        console.log("사용자 정보 업데이트 완료");
        res.status(200).json({
            message: "사용자 정보 업데이트 완료",
            data: {
                user: output
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "server error"
        })
    }
})

//비밀번호 업데이트
router.put('/password', authUtils.LoggedIn, async function (req, res, next) {

    const userEmail = req.userEmail

    const {
        originalPW,
        newPW,
        confirmPW
    } = req.body

    try {
        var user = await users.findOne({
            email: userEmail
        }, {
            _id: 1,
            password: 1,
            salt: 1
        })
        if (!user) return res.status(403).json({
            message: "존재하지 않는 사용자입니다. "
        })

        //1. 기존 비밀번호 체크
        const key = encryption.makeCrypto(originalPW, user.salt);
        if (!originalPW || key.toString('base64') != user.password) {
            const errData = {
                message: `기존 비밀번호를 올바르게 입력하세요.`,
            }
            console.log("기존 비밀번호 오류");
            res.status(402).json(errData);
            console.log(errData);
            return;
        }
        //2. 파라미터 체크
        if (!originalPW || !newPW || !confirmPW) {
            const missParameters = Object.entries({
                    originalPW,
                    newPW,
                    confirmPW
                })
                .filter(it => it[1] == undefined).map(it => it[0]).join(', ');

            const errData = {
                message: `필요한 정보를 모두 입력하세요.`
                // data: `${missParameters}`
            }
            console.log("필요 정보 부족");
            res.status(400).json(errData);
            console.log(errData);
            return;
        }
        //3. 비밀번호 확인
        if (newPW != confirmPW) {
            const errData = {
                message: `비밀번호 확인을 올바르게 입력하세요.`,
            }
            console.log("비밀번호 확인 실패");
            res.status(403).json(errData);
            console.log(errData);
            return;
        }
        //4. 비밀번호 변경
        const newKey = encryption.makeCrypto(newPW, user.salt);
        user.password = newKey.toString('base64');
        user.save()
            .then((user) => {
                res.status(200).json({
                    message: "비밀번호 업데이트 성공",
                    data: {
                        user: user
                    }
                })
                return;
            })
    } catch (err) {
        console.log("비밀번호 업데이트 실패");
        res.status(500).json({
            message: "server error"
        })
        return;
    }
})


//프로필 사진 업데이트
router.put('/image', authUtils.LoggedIn, upload.single('image'), function (req, res) {

    const userEmail = req.userEmail
    const profileImage = req.file

    users.findOne({
            email: userEmail
        }, {
            profileImage: profileImage.location
        })
        .then((user) => {

            if (!user) return res.status(403).json({
                message: "존재하지 않는 사용자입니다. "
            })

            user.profileImage = profileImage.location
            console.log(user.profileImage)
            user.save()
                .then((user) => {
                    res.status(200).json({
                        message: "프로필 사진 업데이트 완료",
                        data: {
                            user: user
                        }
                    })
                    console.log("프로필 사진 업데이트 완료");
                })
        })
        .catch((err) => {
            res.status(500).json({
                message: "server error"
            })
            console.log(err);
        })
})


module.exports = router;