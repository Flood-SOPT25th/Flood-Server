var express = require('express');
var router = express.Router();
const users = require('../../../model/user');
const groups = require('../../../model/group');
var upload = require('../../../module/awsUpload');
var encryption = require('../../../module/encryption');

router.post('/',upload.single('image'),async (req,res)=>{
    const {email, password, name, phone, rank, question, answer} = req.body;
    const profileImage = req.file;

    //1. 파라미터체크
    if(!email || !password || !name || !phone || !question || !answer){
        const missParameters = Object.entries({email, password, name, phone, rank, question, answer})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "필수 정보를 입력하세요.",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        return;
    }

    //2.아이디 중복 체크
    try{
        const result = await users.findOne({email:email},{_id:0,email:1})
        if(result){
            res.status(409).json({
                message:"이미 존재하는 이메일 입니다."
            })
            return;
        }
    }catch(err){
        if(err){
            res.status(500).json({
                message:"email server error."
            })
            return;
        }
    }

    //3.비밀번호 암호화
    const salt = encryption.salt();
    const key = encryption.makeCrypto(password,salt);

    //6. 회원 가입 완료
    var userModel = new users();
    userModel.email = email;
    userModel.salt = salt;
    userModel.password = key.toString('base64');
    userModel.name = name;
    userModel.phone = phone;
    userModel.rank = rank;
    userModel.profileImage = profileImage.location;
    userModel.question = question;
    userModel.answer = answer;
    userModel.save()
    .then((newUser) =>{
        res.status(200).json({
            message:"회원가입 완료",
            data:{
                userEmail: newUser.email
            }
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message:"server error",
            err:{
                err:err
            }
        })
    })
})

module.exports = router;