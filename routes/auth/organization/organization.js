var express = require('express');
var router = express.Router();
const groups= require('../../../model/group');


/* todo organization/signup
- url : /auth/signup/organization
- method post
- request
{
        name : "네이버",
        phone : "031-247-7153",
        department : "marketing",
        category: ["it","work"],
        groupImage:"블라블라"
}

var groupSchema = new Schema({
    name:{type: String, required : true}, //네이버.. 다음
    phone : {type: String, required :true}, // 010-5409-9859 슬래시 표현은 정규표현식??
    department: String, // 직무 마케팅, 개발..
    category:[String],
    groupImage:String,
    groupCode:{type:String, unique:true} // 처음엔 null값이었다가 조직 생성 완료되면 코드 삽입
})

message (200)
{
        message: "조직생성 완료",
        code : "e2eq2e1"
}
*/
router.post('/signup/organization', (req,res)=>{
    /* to do
    1. 파라미터 체크
    2. 이미 등록된 부서 체크
    3. 코드 발급
    4. 카테고리 설정

    */

    const {name, phone, department, category,groupImage} = req.body;
    console.log(req.body);
    
    //1. 파라미터 체크
    if(!name || !phone || !department || !category || !groupImage){
        const missParameters = Object.entries({name, phone, department, category, groupImage})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "필수 정보를 입력하세요.",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }
    //2. 등록된 부서 체크  ->

    if(groups.find().all([{"name":name}, {"department":department}])){  //회사 이름과 부서가 동일한 정보가 있다면
        const errData = {
            message:"이미 존재하는 회사 와 부서입니다."
        }
        res.status(403).json(errData);
        console.log(errData);
        return;
    }
    //3. 코드 발급!
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 9; i++ )
        code += possible.charAt(Math.floor(Math.random() * possible.length));

    console.log(code);
    

    


    
})


module.exports= router;