var express = require('express');
var router = express.Router();
const users = require('../../../model/user');
var encryption = require('../../../module/encryption');

router.post('/',async (req,res)=>{
    const {email, password, name, phone, question, answer} = req.body;

    //1. 파라미터체크
    if(!email || !password || !name || !phone || !question || !answer){
        res.status(200).json({
            message: "필수 정보를 입력하세요."
        });
        return;
    }

    //2.아이디 중복 체크
    try{
        const result = await users.findOne({email:email},{_id:0,email:1})
        if(result){
            res.status(200).json({
                message:"이미 존재하는 이메일 입니다."
            })
            return;
        }
    }catch (err) { 
        if(err){
            res.status(200).json({
                message:"email server error."
            })
            return;
        }
    }

    //3.핸드폰번호 중복 체크
    try{
        const result = await users.findOne({phone:phone},{_id:0,phone:1})
        if(result){
            res.status(200).json({
                message:"이미 존재하는 연락처 입니다."
            })
            return;
        }
    }catch (err) { 
        if(err){
            res.status(200).json({
                message:"phone number server error."
            })
            return;
        }
    }

    //4.비밀번호 암호화
    const salt = encryption.salt();
    const key = encryption.makeCrypto(password,salt);

    //5. 회원 가입 완료
    var userModel = new users();
    userModel.email = email;
    userModel.salt = salt;
    userModel.password = key.toString('base64');
    userModel.name = name;
    userModel.phone = phone;
    userModel.question = question;
    userModel.answer = answer;
    userModel.save()
    .then((newUser) =>{
        res.status(200).json({
            message:"회원가입 완료"
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message:"서버 에러"
        })
    })
})

module.exports = router;