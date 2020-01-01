var express = require('express');
var router = express.Router();
const users = require('../../../model/user');
const encryption = require('../../../module/encryption');

router.post('/', async (req,res)=>{
    
    const {email, question, answer} = req.body;
    
    if(!email || !question || !answer){
        res.status(400).json({
            message:"모든 정보를 입력해주세요."
        })
        return;
    }

    try{
        const result = await users.findOne({email:email}, {_id:0, email:1, question:1, answer:1});
        //아이디 체크
        if(!result.email){
            res.status(403).json({
                message:"존재하지 않는 아이디."
            })
            return;
        }
        //질문 응답 체크
        if((question != result.question) || (answer != result.answer)){
            res.status(409).json({
                message:"입력한 질문 응답 불일치."
            })
            return;
        }

        res.status(200).json({
            message:"모든 정보 일치. 비밀번호 설정으로 이동.",
            data:result.email
        })
        return;

    }catch(err){
        if(err){
            res.status(500).json({
                message:"server error"
            })
        }
        return;
    }
})

router.put('/modifyPw', async (req,res)=>{
    const {email,password} = req.body;

    //1.파라미터 체크
    if(!email || !password){
        res.status(400).json({
            message:"필수 정보를 입력하세요."
        })
        return;
    }

    //2.비밀번호 암호화
    const salt = encryption.salt();
    const key = encryption.makeCrypto(password,salt);
    console.log(password);

    //3.DatabaseUpdate
    try{
        const result = await users.findOneAndUpdate({email:email}, {$set:{salt:salt, password:key.toString('base64')}}, {new:true});
        if(!result){
            res.status(409).json({
                message:"이메일 정보 일치하지 않음."
            })
        }
        console.log(result.password);
        res.status(200).json({
            message:"패스워드 변경 완료."
        })
        return;
    }catch(err){
        if(err){
            res.status(500).json({
                message:"server error"
            })
        }
    }
})

module.exports = router;