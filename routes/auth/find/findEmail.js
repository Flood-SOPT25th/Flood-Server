var express = require('express');
var router = express.Router();
const users = require('../../../model/user');
router.post('/', async (req,res)=>{

    /* 아이디 찾기 
    이름, 연락처 받고  아이디 리턴
    to do
    1. 이름 이랑 연락처 일치하지 않으면 일치하는 아이디 없음.
    2. 아이디 리턴
    */ 
    const {name, phone} = req.body;
    try{
        const result = await users.findOne({name:name, phone:phone}, {_id:0, email:1});
        if(!result){
            res.status(409).json({
                message:"입력한 정보 불일치!."
            })
            return;
        }

        res.status(200).json({
            message:"아이디 찾기 성공.",
            data:result
        })
        return;
    }catch(err){
        if(err){
            res.status(500).json({
                message:"server error."
            })
            return;
        }
    }
})
module.exports = router;