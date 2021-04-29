const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/google', function(req, res, next) {
    res.send('google login');
});

router.get('/facebook', function(req, res, next) {
    res.send('facebook login');
});

router.get('/kakao', function(req, res, next) {
    res.send('kakao login');
});

router.get('/naver', function(req, res, next) {
    res.send('naver login');
});


module.exports = router;
