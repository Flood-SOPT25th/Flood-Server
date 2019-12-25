var express = require('express');
var router = express.Router();

router.use('/member',require('./member.js')) // 그룹의 맴버 확인
router.use('/code',require('./code.js')) // 그룹의 코드 확인

module.exports = router;