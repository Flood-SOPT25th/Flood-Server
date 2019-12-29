var express = require('express');
var router = express.Router();

router.use('/',require('./signin'));

module.exports = router;