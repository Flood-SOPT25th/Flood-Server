var express = require('express');
var router = express.Router();

router.use('/', require('./organization'));


module.exports = router;