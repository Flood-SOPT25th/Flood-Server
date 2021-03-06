# :ocean: Flood
<img style="border: 1px solid black !important; border-radius:20px;" src="https://flood-master.s3.ap-northeast-2.amazonaws.com/KakaoTalk_Photo_2020-01-02-03-54-55-1.png" width="200px" />

![node_badge](https://img.shields.io/badge/node-%3E%3D%208.0.0-green)
![npm_bedge](https://img.shields.io/badge/npm-v6.10.1-blue)

* <b> SOPT 25th APPJAM
    
* 프로젝트 기간: 2019.12.22 ~ 2019.01.04

* [API 문서](https://github.com/Flood-SOPT25th/Flood-Server/wiki)</b>

<br>


## :bookmark_tabs: 프로젝트 설명

<b>정보를 공유하는 가장 쉬운 방법, Flood입니다. :ocean:</b>
회사내에 분산된, 정보 공유를 더 빠르고 쉽게 공유하는 플랫폼으로  정보의 홍수 속에서 
각각 회사들이 공유하고 있는 정보를 필터링하여 일반 유저들에게 제공하는 서비스입니다.

<br>

## :bookmark_tabs: WorkFlow

![node_badge](https://flood-master.s3.ap-northeast-2.amazonaws.com/KakaoTalk_Photo_2020-01-03-23-51-00.png)

<br>

## :earth_americas: Team Role 


#### :surfing_man: 이동훈 

- 게시물, 북마크, 댓글 관련 DB 설계및 구축
- 북마크 기능 구현
- 게시물 업로드, 수정 기능 구현
- 댓글 및 대댓글 기능 구현
- 프록시 서버 및 메인 서버 설정, 배포
- Docker build 및 이미지 관리

#### :surfing_woman: 박주연 

- 마이페이지 프로필 설정 변경 기능 구현
- 이미지 및 비밀번호 변경 기능 구현
- 조직설정, 계정관리 기능 구현
- 테스팅 자동화 환경 구축

#### :surfing_man: 최영훈

- user, group 관련 DB 설계및 구축
- 회원가입 기능 구현
- 로그인 기능 구현
- 조직 생성 기능 구현
- 비밀번호 찾기 구현
- 아이디 찾기 구현

<br>

## :heavy_check_mark: Features

- url로 해당 게시물의 썸네일, 제목, 소개 크롤링.
- 공유하기 버튼을 사용하여, 쉽게 공유하기 가능.
- 그룹 내 사용자들의 조회수 및 북마크수를 기반으로 Top3 게시물 추천.
- 회사 내에 게시물들을 정리하여 통계적 그래프로 시각화.
- 중복되지 않는 조직 코드 생성

<br>

## :blue_book: Package

사용 패키지(모듈)은 다음과 같습니다.

- **cheerio-httpcli** : 뉴스 기사 크롤링 및 파싱 도구
- **crypto** : 패스워드 암호화 및 인증 
- **express** : 웹,서버 개발 프레임워크
- **express-formidable** : form-data 파싱 도구
- **jsonwebtoken** : JWT(Json Web Token) 생성 및 인증 
- **multer** : 파일 업로드 도구
- **multer-s3** : AWS S3 파일 업로드 도구
- **rand-token** : 랜덤 토큰 생성 도구
- **moment** : 임의의 문자열과 unix시간을 조합해 중복되지 않는 조직코드 생성
- **mocha** : 테스팅 자동화 환경 구축 


```json
"dependencies": {
    "aws-sdk": "^2.596.0",
    "chai": "^4.2.0",
    "cheerio-httpcli": "^0.7.4",
    "cookie-parser": "~1.4.4",
    "crypto": "^1.0.1",
    "debug": "~2.6.9",
    "ejs": "~2.6.1",
    "expect": "^24.9.0",
    "express": "~4.16.1",
    "express-formidable": "^1.2.0",
    "http-errors": "~1.6.3",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.24.0",
    "mongoose": "^5.8.3",
    "morgan": "~1.9.1",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "multiparty": "^4.2.1",
    "nodemon": "^2.0.2",
    "path": "^0.12.7",
    "rand-token": "^0.4.0",
    "request": "^2.88.0",
    "should": "^13.2.3",
    "supertest": "^4.0.2",
    "uuid": "^3.3.3"
  },
  "devDependencies": {
    "mocha": "^6.2.2"
  }
```

<br>

## :green_book: Architecture

![architecture](https://flood-master.s3.ap-northeast-2.amazonaws.com/Untitled+Diagram+(1)+(2).png)  

<br>

## :orange_book: DB ERD

![ERD](https://flood-master.s3.ap-northeast-2.amazonaws.com/Untitled+Diagram.png)

<br>

## :closed_book: 배포

* AWS EC2 - 클라우드 컴퓨팅 시스템
* AWS elastic beanstlak - 서버 배포및 관리 프로비저닝 서비스
* AWS S3 - 클라우드 데이터 저장소
* Atlas - MongoDB 클라우드 호스팅 서비스
* Docker - 컨테이너 기반 가상화 소프트웨어 플랫폼
* Nginx - 프록시 서버 (보안 향상 및 캐시를 활용한 전송 속도 향상)

<br>

## :books: 사용된 도구 

* [Node.js](https://nodejs.org/ko/)
* [Express.js](http://expressjs.com/ko/) 
* [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
* [PM2](http://pm2.keymetrics.io/) - 프로세스 관리자
* [MongoDB](https://www.mongodb.com/) - NoSQL DB
* [Docker](https://www.docker.com/) - 컨테이너 기반 가상화 플랫폼
* [Nginx](https://www.nginx.com/) - 웹 서버 소프트웨어(프록시 서버용)

<br>


## :computer: 개발자

* [박주연](https://github.com/Ju-Yeon)
* [이동훈](https://github.com/donghunee)
* [최영훈](https://github.com/dudgns3tp)

