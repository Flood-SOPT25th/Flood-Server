var express = require('express');
var router = express.Router();

router.use('/findPw', require('./findPw'));
router.use('/',require('./signin'));

module.exports = router;