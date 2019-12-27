var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var encryption = require('../../module/encryption');
var upload = require('../../module/awsUpload');
var groups = require("../../model/group");
var users = require("../../model/user");
const jwt = require('../../module/jwt');


router.get('/',  function(req, res, next) {
    //const userEmail = 'uploadTest@gmail.com4' //로그인 정보
    
    var token = req.get('accessToken');
    if(typeof token !== 'undefined'){
        var decoded = jwt.verify(token);
    const userEmail = decoded.email

    
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
    }else{
        res.status(403).json({
            message: "사용자 정보 없음"
        });
    }  
});

//프로필 정보 업데이트
router.put('/', async function(req, res, next){
    
    var token = req.get('accessToken');
    if(typeof token !== 'undefined'){
        var decoded = jwt.verify(token);
    const userEmail = decoded.email

    //const userEmail = 'c_yh0327@naver.com6' //로그인 정보
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
    }else{
        res.status(403).json({
            message: "사용자 정보 없음"
        });
    }
})

//비밀번호 업데이트
router.put('/password', async function(req, res, next){
    
    var token = req.get('accessToken');
    if(typeof token !== 'undefined'){
        var decoded = jwt.verify(token);
        const userEmail = decoded.email

        //const userEmail = 'test' //로그인 정보
        //const {originalPW, newPW,  confirmPW} = req.body

    try{
        //console.log(req.body)
        var user = await users.findOne({email: userEmail}, {_id: 1, password: 1, salt: 1})
        
        //1. 기존 비밀번호 체크
        const key = encryption.makeCrypto(originalPW, user.salt);
        if( !originalPW || key.toString('base64') != user.password){
            const errData = {
                message: `올바른 기존 비밀번호를 입력하세요.`,
            }
            console.log("기존 비밀번호 오류");
            res.status(400).json(errData);
            console.log(errData);
            return;
        }
        //2. 파라미터 체크
        if(!originalPW || !newPW || !confirmPW ){
            const missParameters = Object.entries({originalPW, newPW,  confirmPW})
            .filter(it =>it[1] == undefined).map(it => it[0]).join(', ');

            const errData = {
                message: `필요한 정보를 모두 입력하세요.`,
                data:`${missParameters}`
            }
            console.log("정보 부족");
            res.status(400).json(errData);
            console.log(errData);
            return;
        }
        //3. 비밀번호 확인
        if(newPW != confirmPW ){
            const errData = {
                message: `비밀번호 확인을 올바르게 입력하세요.`,
            }
            console.log("비밀번호 확인 실패");
            res.status(400).json(errData);
            console.log(errData);
            return;
        }
        //4. 비밀번호 변경
        const newKey = encryption.makeCrypto(newPW,user.salt);
        user.password = newKey.toString('base64');
        user.save()
        .then((user) => {
            res.status(200).json({
                message: "비밀번호 업데이트 성공",
                data:{
                    user : user
                }
            })
            return;
        })  
    }catch(err){
        console.log("실패"+err);
        res.status(500).json({
            message: err
        })
        return;
    }
}else{
    res.status(403).json({
        message: "사용자 정보 없음"
    });
}
})


//프로필 사진 업데이트
router.put('/image', upload.single('image'), function(req, res) {
    
    var token = req.get('accessToken');
    if(typeof token !== 'undefined'){
        var decoded = jwt.verify(token);
        const userEmail = decoded.email

    const profileImage = req.file
    //const userEmail = 'uploadTest3@gmail.com' //로그인 정보

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
        }else{
            res.status(403).json({
                message: "사용자 정보 없음"
            });
        }
        })


module.exports = router;