var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Index is called');
  res.render('index', { title: 'Eat Da Burger!' });
});

module.exports = router;
