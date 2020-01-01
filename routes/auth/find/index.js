var express = require('express');
var router = express.Router();

//router.use('/findPw', require('./findPw'));
router.use('/findEmail',require('./findEmail'));

module.exports = router;