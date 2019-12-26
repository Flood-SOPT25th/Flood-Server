var express = require('express');
var router = express.Router();


router.use('/',require('./comment.js')) // 그룹의 코드 확인

module.exports = router;