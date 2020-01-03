var express = require('express');
var router = express.Router();
const authUtils = require('../../../module/authUtils');
const users = require('../../../model/user');
const upload = require('../../../module/awsUpload');

router.put('/', authUtils.LoggedIn, upload.single('image'), async (req,res)=>{
    
    //1. 값 받기
    const {profileName, rank} = req.body;
    const email = req.userEmail;
    const profileImage =req.file;

    //2. 파라미터처리
    if(!profileName || !rank ){
        res.status(400).json({
            message: "필수 정보를 입력하세요."
        });
        return;
    }

    //3. 저장
    try{
        const result = await users.findOneAndUpdate({email:email}, {$set:{profileName:profileName, rank:rank, profileImage:profileImage.location}},{new:true}); //업데이트 
        if(!result){
            res.status(403).json({
                message:"프로필 업데이트 실패."
            })
            return;
        }

        res.status(200).json({
            message:"프로필 업데이트 성공."
        })
        return;
    }catch(err){
        if(err){
            res.status(500).json({
                message:"profile server error."
            })
            return;
        }
    }
})

module.exports = router;