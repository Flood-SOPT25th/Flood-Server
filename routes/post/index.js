var express = require('express');
var router = express.Router();

router.use('/',require('./post.js'))
router.use('/count',require('./postCount.js'))
router.use('/bookmark',require('./bookmark.js'))

module.exports = router;