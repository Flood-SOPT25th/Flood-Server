/*
북마크 테스트
기존 사용자 정보를 통해 로그인 후 북마크한 게시물 조회 및 detail페이지 조회
*/
var should = require('should');
var assert = require("assert")
var request = require("supertest");
var expect = require("chai").expect;
var server = require("../app.js");

describe("북마크 테스트 ->", function () {
    var svr = "http://flooddocker-env.3gfczrrijh.ap-northeast-2.elasticbeanstalk.com";
    var token;

    //서버 연결
    before(async function () {
        result = await server.listen()
    });

    describe("북마크 테스트", function () {
        //기존 사용자 토큰 삽입
        beforeEach(function (done) {
            const user_data = {
                email: 'test',
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

        /*
        it("게시물 북마크 추가", function (done) {
            const data = {
                post_id: '5e009585beecc40d80a4c835',
                category_id:'5e05b94a6e715e62f32dfc59'
            };
            request(svr)
                .post("/post/bookmark/add")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
        */

        it("유저 북마크 조회 성공", function (done) {
            request(svr)
                .get("/post/bookmark")
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    //카테고리 설정 default: all
                    done();
                });
        });


        it("해당 북마크 게시물 조회", function (done) {
            request(svr)
                .get(`/post/bookmark/detail?category=all`)
                .set('Authorization', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        /*
        it("게시물 북마크 취소", function (done) {
            const data = {
                post_id: '5e009585beecc40d80a4c835'
            }
            request(svr)
                .post("/post/bookmark/cancel")
                .set('Authorization', token)
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
        */
    });

    //서버 연결 해제
    after(function () {
        result.close();
    });
});