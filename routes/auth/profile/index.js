var express = require('express');
var router = express.Router();

router.use('/', require('./profile'));

module.exports = router;