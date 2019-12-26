var express = require('express');
var router = express.Router();
const crypto = require('crypto');

var upload = require('../../module/awsUpload');
var groups = require("../../model/group");
var users = require("../../model/user");


router.get('/',  function(req, res, next) {
    const userEmail = 'uploadTest@gmail.com4' //로그인 정보
    
    users.findOne({email: userEmail}, {_id: 0, name: 1, rank: 1, groupCode: 1, profileImage: 1, bookmark: 1})
        .then(async (user) => {

        if (!user) return res.status(404).json({message:"user not found"})
        const result =  await groups.findOne({groupCode : user['groupCode']}, {_id: 0, name: 1})
        let fin = {
            group : result,
            user : user
        }
        return fin
        })
        .then((fin) => {

            console.log("사용자 정보 불러오기 성공");
            res.status(200).json({
            message: "Read user success",
            data:{
                    user: fin.user,
                    group: fin.group
                }
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: err
            })
        })     
});

//프로필 정보 업데이트
router.put('/', async function(req, res, next){
    const userEmail = 'c_yh0327@naver.com6' //로그인 정보
    const {name, rank,  phone, profileImage} = req.body

    if(!name || !rank || !phone ){
        const missParameters = Object.entries({name, rank, phone})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(', ');
        
        const errData = {
            message: `필요한 정보를 입력하세요.`,
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    try{
        var user = await users.findOne({email: userEmail}) //
        if (!user) return res.status(404).json({message:"user not found"})
        user.name = name
        user.rank = rank
        user.phone = phone
        user.profileImage = profileImage

        var output = await user.save();
        console.log("사용자 정보 업데이트 완료");
        res.status(200).json({
            message: "Update success",
            data:{
                user : output
            }
        })
    } catch(err) {
        res.status(500).json({
            message: err
        })
    }

})

//비밀번호 업데이트
router.put('/password', async function(req, res, next){
    const userEmail = 'c_yh0327@naver.com6' //로그인 정보
    const {originalPW, newPW,  confirmPW} = req.body

    //1. 기존 비밀번호 체크



    //2. 파라미터 체크
    if(!originalPW || !newPW || !confirmPW ){
        const missParameters = Object.entries({name, rank, phone})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(', ');
        
        const errData = {
            message: `필요한 정보를 입력하세요.`,
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    //3. 비밀번호 확인

    
    //4. 비밀번호 변경
    try{
        var user = await users.findOne({email: userEmail}) //
        if (!user) return res.status(404).json({message:"user not found"})
        user.name = name
        user.rank = rank
        user.phone = phone
        user.profileImage = profileImage

        var output = await user.save();
        console.log("사용자 정보 업데이트 완료");
        res.status(200).json({
            message: "Update success",
            data:{
                user : output
            }
        })
    } catch(err) {
        res.status(500).json({
            message: err
        })
    }

})

//프로필 사진 업데이트
router.put('/image', upload.single('image'), function(req, res) {
    const profileImage = req.file
    const userEmail = 'uploadTest3@gmail.com' //로그인 정보

    users.findOne({email: userEmail}, {profileImage: profileImage.location})
        .then((user) =>{
            
            if (!user) return res.status(404).json({message:"user not found"})
            
            user.profileImage = profileImage.location
            console.log(user.profileImage)
            user.save()
            .then((user) => {
                res.status(200).json({
                    message:"프로필 사진 업데이트 완료",
                    data:{
                        user: user
                    }
                })
                console.log("프로필 사진 업데이트 완료");
            })
        })
        .catch((err) => {
            res.status(500).json({
                message:"프로필 사진 업데이트 실패",
                err: err
            })
            console.log(err);
            }) 
        })


module.exports = router;