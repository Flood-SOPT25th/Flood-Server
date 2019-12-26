var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/comment', require('./comment'));
router.use('/mypage', require('./mypage'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
