/*
조직 테스트
새로운 사용자 회원가입 후, 기존 조직에 가입 및, 조직 생성 후 가입 
*/
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");
var randomCode = require("../Module/randomCode")

describe("조직 테스트 ->", async function () {
    var svr = "http://flooddocker-env.3gfczrrijh.ap-northeast-2.elasticbeanstalk.com";
    var randomEmail, randomPhone, token, groupCode;

    //서버 연결
    before(async function () {
        result = await server.listen();
    });

    //새로운 회원가입
    beforeEach(function (done) {
        randomEmail = randomCode.randCode();
        randomPhone = randomCode.randNumber();
        //새로 가입할 사용자 정보
        var data = {
            email: `${randomEmail}`,
            password: '123123',
            name: '김테스트',
            phone: `${randomPhone}`,
            question: '내가 나온 초등학교는?',
            answer: '석우초등학교'
        }
        request(svr)
            .post("/auth/signup")
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                //console.log(`email: ${randomEmail}`)
                //console.log(`password: 123123`)
                done();
            });
    });

    describe("새로운 조직 생성 후 가입 성공", function () {
        //새로 회원가입한 아이디 토큰 삽입
        beforeEach(function (done) {
            var user_data = {
                email: `${randomEmail}`,
                password: '123123'
            };

            request(svr)
                .post("/auth/signin")
                .send(user_data)
                .end(async function (err, res) {
                    if (err) return done(err);
                    var result = await JSON.parse(res.text);
                    token = await result.data.token;
                    done();
                });
        });

        it("조직 생성 테스트", function (done) {
            //새로 생성할 조직 정보 
            var data = {
                name: `test${randomPhone[9]}${randomPhone[10]}${randomPhone[11]}${randomPhone[12]}`,
                phone: '010-1234-5678',
                department: '개발',
                category: ['IT', '디자인', '마케팅']
            };

            request(svr)
                .post("/auth/signup/organization")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(async function (err, res) {
                    if (err) return done(err);
                    var result = await JSON.parse(res.text);
                    groupCode = await result.code;
                    //console.log(`groupCode: ${groupCode}`)
                    done();
                });
        });

    });

    describe("기존 조직 가입 성공", function () {
        //새로 회원가입한 아이디 토큰 삽입
        beforeEach(function (done) {
            var user_data = {
                email: `${randomEmail}`,
                password: '123123'
            };
            request(svr)
                .post("/auth/signin")
                .send(user_data)
                .end(async function (err, res) {
                    if (err) return done(err);
                    var result = await JSON.parse(res.text);
                    token = await result.data.token;
                    done();
                });
        });

        it("조직 가입 테스트", function (done) {
            var data = {
                groupCode: `${groupCode}`
            };
            request(svr)
                .post("/auth/signin/organization")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    //console.log(`groupCode: ${groupCode}`)
                    done();
                });
        });
    });

    //서버 연결 해제
    after(function () {
        result.close();
    });

});