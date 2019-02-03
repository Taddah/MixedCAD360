var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/ra', function(req, res, next) {
  res.render('ra');
});

module.exports = router;
