var express = require('express');
var router = express.Router();
const users = require('../../../model/user');

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

module.exports = router;