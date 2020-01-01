var express = require('express');
var router = express.Router();

router.use('/signup', require('./signup'));
router.use('/signin',require('./signin'));
router.use('/find',require('./find'));
router.use('/profile', require('./profile'));

module.exports = router;