/*
마이페이지 테스트
기존 사용자 정보를 통한 마이페이지 조회, 프로필 변경, 프로필 이미지 변경, 비밀번호 변경
*/
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");

describe("마이페이지 테스트 ->", function () {
    var svr = "http://flooddocker-env.3gfczrrijh.ap-northeast-2.elasticbeanstalk.com";
    var token;
    //기존 사용자 정보
    var user_data = {
        email: "test",
        password: "123123"
    };

    //서버 연결
    before(async function () {
        result = await server.listen()
    });

    beforeEach(function (done) {
        //기존 아이디 토큰 삽입
        request(svr)
            .post("/auth/signin")
            .send(user_data)
            .end(async function (err, res) {
                if (err) return done(err);
                var result = JSON.parse(res.text);
                token = await result.data.token;
                done()
            });

    });

    describe("마이페이지 메인페이지 테스트", function () {
        it("마이페이지 유저정보 조회 성공", function (done) {
            request(svr)
                .get("/mypage/main")
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 북마크리스트 조회 성공", function (done) {
            request(svr)
                .get("/post/bookmark")
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe("마이페이지 프로필설정 테스트", function () {
        it("마이페이지 프로필 조회 성공", function (done) {
            request(svr)
                .get("/mypage/setting")
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 프로필 변경 성공", function (done) {
            //변경할 프로필 정보
            var data = {
                "name": "이동훈",
                "phone": "01012345678",
                "rank": "사장"
            }

            request(svr)
                .put("/mypage/setting")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 비밀번호 변경 성공", function (done) {
            //비밀번호 변경 정보
            var data = {
                "originalPW": "123123",
                "newPW": "123123",
                "confirmPW": "123123"

            }

            request(svr)
                .put("/mypage/setting/password")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 이미지 변경 성공", function (done) {
            request(svr)
                .put("/mypage/setting/image")
                .set('Authorization', token)
                .field('Content-Type', 'multipart/form-data')
                .attach('image', 'public/images/thumb.jpg')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

    });

    describe("마이페이지 조직설정 테스트", function () {
        it("마이페이지 조직설정 조회 성공", function (done) {
            request(svr)
                .get("/mypage/member")
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 조직설정 Admin 계정추가 성공", function (done) {
            //추가할 계정
            var data = {
                "member_email": [
                    "test0",
                    "ehdgns1766@gmail.com"
                ]
            }

            request(svr)
                .put("/mypage/member/add")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it("마이페이지 조직설정 계정삭제 성공", function (done) {
            //삭제할 계정
            var data = {
                "member_email": [
                    "test0"
                ]
            }

            request(svr)
                .put("/mypage/member/delete")
                .set('Authorization', token)
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