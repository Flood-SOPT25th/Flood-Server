var express = require('express');
var router = express.Router();

router.use('/organization', require('./organization'));
router.use('/', require('./signup'));

module.exports = router;