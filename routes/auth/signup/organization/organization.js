var express = require('express');
var router = express.Router();
var randomCode = require('../../../../module/randomCode');
const groups = require('../../../../model/group');
var upload = require('../../../../module/awsUpload');

router.post('/',upload.single('image'),(req,res)=>{
    const{name, phone, department, category} = req.body;
    const groupImage = req.file;

    //1. 파라미터체크
    if(!name || !phone || !department || !groupImage || !category){
        const missParameters = Object.entries({name, phone, department, groupImage, category})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "모든 정보를 입력해 주세요",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        return;
    }
    //2 기업 코드 생성
    groupCode = randomCode.randCode();

    var groupModel = new groups();
    groupModel.name = name;
    groupModel.phone = phone;
    groupModel.department = department
    groupModel.groupCode = groupCode;
    groupModel.groupImage = groupImage.location;

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
            message:"server error",
            data:err
        })
    })
})

module.exports = router;