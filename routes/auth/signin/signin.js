var express = require('express');
var router = express.Router();
const user = require('../../../model/user');
const groups = require('../../../model/group');
const encryption = require('../../../module/encryption');
const jwt = require('../../../module/jwt');
const authUtils = require('../../../module/authUtils');
router.post('/',async (req,res)=>{

    const{email, password} = req.body;

    //1. 파라미터체크
    if(!email || !password){
        const missParameters = Object.entries({email, password})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "아이디와 비밀번호를 입력 해 주세요."
            // data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    //2.아이디 확인
    try{
        var result = await user.findOne({email:email});
        if(!result){
            res.status(200).json({
                message:"존재하지 않는 계정 입니다."
            })
            return;
        }
    } catch(err){
        res.status(500).json({
            message:"아이디 체크 오류."
            // err:err
        })
        return;
    }

    //3.비밀번호 체크
    try{
        const userData = await user.findOne({email:email});
        const dbPw = (encryption.makeCrypto(password, userData.salt)).toString('base64');        
        if(dbPw == userData.password){
            const result = jwt.sign(userData);
            await user.updateOne({email:email}, {$set:{refreshToken:result.refreshToken}},{new:true}) //리프레시 토큰 db저장
            res.status(200).json({
                message:"로그인 완료",
                data:result
            })
            return;
        }

        if(dbPw != password){
            res.status(200).json({
                message:"비밀번호가 다릅니다."
            })
            return;
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"서버 에러"
            // data:err
        })
        return;
    }
})

router.post('/organization', authUtils.LoggedIn, async (req,res)=>{

    const userEmail = req.userEmail;
    const {groupCode} = req.body;
    
    //1. 코드 번호 확인 #확인
    try{
        const result = await groups.findOne({groupCode:groupCode},{_id:0,groupCode:1});
        if(!result.groupCode){
            res.status(403).json({
                message:"유효하지 않는 그룹 코드입니다."
            })
        return;
        }
    } catch(err){
        res.status(500).json({
            message:"group code server error"
        })
        return;
    }

    //2. 업데이트
    try{
        const result = await user.findOneAndUpdate({email:userEmail}, {$set:{groupCode:groupCode}},{new:true});
        if(result){
            res.status(200).json({
                message:"그룹 가입 성공."
            })
            return;
        }
    }catch(err){
        if(err){
            res.status(500).json({
                message:"server error"
            })
            return;
        }
    }
})

module.exports = router;
