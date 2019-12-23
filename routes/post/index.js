var express = require('express');
var router = express.Router();

router.use('/',require('./post.js'))
router.use('/count',require('./postCount.js'))

module.exports = router;