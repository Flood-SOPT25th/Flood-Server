var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('group', { title: 'Express' });
});

router.get('/detail/:gruop', (req, res, next) => {
    console.log("요요")
    res.render('detail', { title: 'Express' });
})

module.exports = router;
