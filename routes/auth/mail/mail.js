var express = require('express');
var router = express.Router();
var mailConfig = require('../../../config/mailConfig');
var mailAuth = require('../../../module/mailAuth');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport')
const users = require('../../../model/user');
const randomCode = require('../../../module/randomCode');
/*
비밀번호 찾기!
1. 클라이언트 이메일 찾기
2. body 에 이메일 입력
3. 사용자 이메일 스키마 안에 이메일 코드 생성 후 메일로 전송
4. 사용자가 이메일 입력 후 비교
5. password 변경창으로 이동
*/
router.post('/', async (req,res,next)=>{
    //1.body에 이메일 입력
    const {email} = req.body;
    //2.사용자 이메일 스키마 안에 이메일 코드 생성 후 메일로 전송.
    const emailCode = randomCode.randCode();
    try{
        const result = await users.findOneAndUpdate({email:email}, {$set:{emailCode:emailCode}},{new:true});
        if(!result){
            res.status(403).json({
                message:"존재하지 않는 이메일."
            })
            return;
        }
    }catch(err){
        if(err){
            res.status(500).json({
                message:"이메일 코드 서버 에러."
            })
            return;
        }
    }

    //3.이메일 전송 옵션 설정
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yeonghun0327@gmail.com', // gmail 계정 아이디를 입력
            pass: '' // gmail 계정의 비밀번호를 입력
        }
    });

    let mailOptions = {
        from: 'yeonghun0327@gmail.com', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: email, // 수신 메일 주소
        subject: 'Sending Email using Node.js', // 제목
        text: 'That was easy!' // 내용
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect("/");
})

module.exports = router;