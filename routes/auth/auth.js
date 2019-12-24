var express = require('express');
var router = express.Router({mergeParams:true});
const crypto = require('crypto');
const users= require('../../model/user');


router.get('/', (req,res)=>{
    res.send('회원가입');
    res.end();
});
/* todo sign up  -> dummy data 삽입까지만 몽구스는 나중에!
- url : /auth/signup
- method post
- data
{
        name : "이동훈", (필수)
        email : "ehdgns1766@naver.com", (필수)
        password : "ehdgns2797",  ( 확인까지 필수)
        phone : "010-2389-7192",
        rank : "팀장",
        group : "awd1waw",
        profileImage : 블라블라,
}

name:{type: String, required : true},
    email : {type:String, required: true, unique: true},
    password: {type: String, required :true},
    salt : String,
    phone : {type: Number, required :true}, // 010-5409-9859 슬래시 표현은 정규표현식??
    rank:String,
    group:String, // 조직 코드를 넣을지 조직 이름을 넣을지 추후 조정
    profileImage:String,  // 이미지 url ?? // multer aws s3
    bookmark:[String]

- message (200) 
{
        message: "회원가입 완료"
}
*/
//signup

router.post('/signup' ,(req,res)=>{
    /* to do
    1. 파라미터 체크,
    2. 약관 동의 체크
    3. password 암호화
    4. 회원가입 완료
    */
    const {email, password, name, phone, rank, groupCode, checked} = req.body; // 패스워드 해싱해서 오기,  checked 는 약관 동의
    console.log(req.body);

    //1. 파라미터체크
    if(!email || !password || !name || !groupCode){
        const missParameters = Object.entries({email, password, name, phone, rank, groupCode})
        .filter(it =>it[1] == undefined).map(it => it[0]).join(',');
        const errData = {
            message: "필수 정보를 입력하세요.",
            data:`${missParameters}`
        }
        res.status(400).json(errData);
        console.log(errData);
        return;
    }

    //2. 약관 동의 체크 
    if(!checked){
        const errData ={
            message: "이용약관에 동의하세요."
        }
        res.status(400).json(errData);
        console.log(errData);
    }

    //3.비밀번호 암호화
    const salt = name+email;
    const buf= crypto.randomBytes(64);
    const key = crypto.pbkdf2Sync(password, buf.toString('base64'), 112129, 64, 'sha512');
    console.log('암호화: '+key.toString('base64'));


    console.log(req.body);
    //4. 회원 가입 완료
    var userModel = new users();
    userModel.email = email;
    userModel.salt = salt;
    userModel.password =key.toString('base64');
    userModel.name = name;
    userModel.phone = phone;
    userModel.rank = rank;
    userModel.groupCode = groupCode;
    userModel.save()
    .then((newUser) =>{
        res.status(200).json({
            message:"회원가입 완료",
            data:{
                user: newUser
            }
        })
        console.log("회원가입 완료");
    })
    .catch((err)=>{
        res.status(500).json({
            message:"회원가입 실패",
            err: err
        })
        console.log(err);
    })
})

module.exports = router;