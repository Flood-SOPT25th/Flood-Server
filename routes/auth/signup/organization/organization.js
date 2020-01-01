var express = require('express');
var router = express.Router();
var randomCode = require('../../../../module/randomCode');
const groups = require('../../../../model/group');
const users = require('../../../../model/user');
var authUtils = require('../../../../module/authUtils');

router.post('/',authUtils.LoggedIn, async (req,res)=>{
    const userEmail = req.userEmail;
    const{name, phone, department, category} = req.body;

    //1. 조직이 존재하면 코드 생성 불가
    try{
        const result = await users.findOne({email:userEmail},{_id:0, groupCode:1});
        if(result.groupCode != null){ // groupCode가 널값이 아니면
            res.status(409).json({
                message:"이미 조직이 존재합니다."
            })
            return;
        }
    }catch(err){
        if(err){
            res.status(500).json({
                message:"조직 생성자 중복 체크 서버 에러."
            })
            return;
        }
    }

    //2. 파라미터체크 #완료
    if(!name || !phone || !department || !category){
        res.status(400).json({
            message:"모든 정보를 입력해 주세요."
        })
        return;
    }
    //3 기업 코드 생성 #완료
    groupCode = randomCode.randCode();

    //4. 관리자 부여 #완료
    try{
    const result = await users.findOneAndUpdate({email:userEmail}, {$set:{admin:true, groupCode:groupCode}},{new:true});
    }catch(err){
        if(err){
            res.status(500).json({
                message:"관리자 부여 서버 에러"
            })
            return;
        }
    }

    //5. 그룹 생성 #완료
    var groupModel = new groups();
    groupModel.name = name;
    groupModel.phone = phone;
    groupModel.department = department
    groupModel.groupCode = groupCode;
    groupModel.category.push("flood") // 첫 번째 허수 추가
    category.forEach((n) => {
        groupModel.category.push(n)
    })
    groupModel.save()
    .then((newGroup) =>{
        res.status(200).json({
            message:"조직 생성 완료",
            code:newGroup.groupCode
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message:"server error"
            // data:err
        })
    })
})

module.exports = router;