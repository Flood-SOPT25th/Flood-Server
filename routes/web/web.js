var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('group', { title: 'Express' });
});

router.get('/detail/:group', (req, res, next) => {
    res.render('detail', { title: req.params.group });
})

module.exports = router;
