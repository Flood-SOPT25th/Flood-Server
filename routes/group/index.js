var express = require('express');
var router = express.Router();

router.use('/',require('./people.js'))

module.exports = router;