var express = require('express');
var router = express.Router({mergeParams:true});
const crypto = require('crypto');
const users= require('../../model/user');
var upload = require('../../module/awsUpload');

router.post('/signup',upload.single('image'),(req,res)=>{
    const {email, password, name, phone, rank, groupCode, checked} = req.body; //checked 는 약관 동의
    const profileImage = req.file;
    console.log(req.body);

    //1. 파라미터체크
    if(!email || !password || !name || !groupCode){
        const missParameters = Object.entries({email, password, name, phone, rank, groupCode})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "필수 정보를 입력하세요.",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    //2. 약관 동의 체크 
    if(!checked){
        const errData ={
            message: "이용약관에 동의하세요."
        }
        res.status(400).json(errData);
        console.log(errData);
    }

    //3.비밀번호 암호화
    const salt = name+email;
    const buf= crypto.randomBytes(64);
    const key = crypto.pbkdf2Sync(password, buf.toString('base64'), 112129, 64, 'sha512');
    console.log('암호화: '+key.toString('base64'));

    
    console.log(req.body);
    //4. 회원 가입 완료
    var userModel = new users();
    userModel.email = email;
    userModel.salt = salt;
    userModel.password = key.toString('base64');
    userModel.name = name;
    userModel.phone = phone;
    userModel.rank = rank;
    userModel.groupCode = groupCode;
    userModel.profileImage = profileImage.location;
    userModel.save()
    .then((newUser) =>{
        res.status(200).json({
            message:"회원가입 완료",
            data:{
                user: newUser
            }
        })
        console.log("회원가입 완료");
    })
    .catch((err)=>{
        res.status(500).json({
            message:"회원가입 실패",
            err: err
        })
        console.log(err);
    })
})

module.exports = router;