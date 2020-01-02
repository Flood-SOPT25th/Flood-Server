var express = require('express');
var router = express.Router();

router.use('/',require('./mail'));
module.exports = router;