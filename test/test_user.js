/*
사용자 테스트
새로운 사용자 정보를 통한 회원가입 및 로그인 
*/
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");
var randomCode = require("../Module/randomCode")

describe("사용자 및 그룹 계정 테스트 ->", async function () {
    var svr = "http://flooddocker-env.3gfczrrijh.ap-northeast-2.elasticbeanstalk.com";
    var randomEmail, randomPhone;

    //서버 연결, 새로운 사용자 정보 값
    before(async function () {
        result = await server.listen();
        randomEmail = await randomCode.randCode();
        randomPhone = await randomCode.randNumber();

    });

    describe("회원가입 테스트", function () {

        it("회원가입 성공", function (done) {
            //새로운 회원가입 사용자 정보
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
                    done();
                });
        });

        it("회원가입 실패 - 이메일 중복", function (done) {
            //중복되는 사용자 정보
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
                    done();
                });
        });

        it("회원가입 실패 - 파라미터 부족", function (done) {
            //부족한 사용자 정보
            var data = {
                "password": "123123"
            }
            request(svr)
                .post("/auth/signup")
                .send(data)
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });


    describe("로그인 성공실패 사례별 테스트", function () {
        it("로그인 성공", function (done) {
            //회원가입한 사용자 정보
            var data = {
                email: `${randomEmail}`,
                password: "123123"
            };

            request(svr)
                .post("/auth/signin")
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("로그인 실패 - 파라미터 부족", function (done) {
            //부족한 사용자 정보
            var data = {
                email: `${randomEmail}`
            };

            request(svr)
                .post("/auth/signin")
                .send(data)
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("로그인 실패 - 비밀번호 오류", function (done) {
            //비밀번호가 틀린 사용자 정보
            var data = {
                email: `${randomEmail}`,
                password: "123122"
            };

            request(svr)
                .post("/auth/signin")
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });


        it("로그인 실패 - 아이디 오류", function (done) {
            //존재하지 않는 회원 정보
            var data = {
                email: "nonExistId",
                password: "123123"
            };

            request(svr)
                .post("/auth/signin")
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });

    //서버 연결 해제
    after(function () {
        result.close();
    });

});