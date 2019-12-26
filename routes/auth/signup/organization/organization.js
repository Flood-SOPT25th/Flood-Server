var express = require('express');
var router = express.Router();
const groups = require('../../../../model/group');
var upload = require('../../../../module/awsUpload');
const randomCode = require(__dirname +'/../../../../module/randomCode');

router.post('/',upload.single('image'),(req,res)=>{
    const{name, phone, department, category} = req.body;
    const groupImage = req.file;

    //1. 파라미터체크
    if(!name || !phone || !department || !groupImage || !category){
        const missParameters = Object.entries({name, phone, department, groupImage, category})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "조직 명을 입력하세요.",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }
    //2 코드 
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
        console.log('조직 생성 완료');
    })
    .catch((err)=>{
        res.status(500).json({
            message:"조직 생성 실패",
            err:err
        })
        console.log(err);
    })
})

module.exports = router;