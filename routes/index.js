const express = require('express');
const router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

router.get('/create_room', function(req, res, next) {
  const video_url = req.query.url
  console.log(video_url);
  res.redirect('/home');
});


router.get('/chat/:id', function(req, res, next) {
  res.render('chat',{room_id : req.params.id});
});


module.exports = router;
