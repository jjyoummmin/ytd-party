const express = require('express');
const router = express.Router();
const getYoutubeTitle = require('get-youtube-title');
const shortid = require('shortid');
module.exports = (db) => {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('welcome', { title: 'Express' });
  });


  router.get('/home', function (req, res, next) {
    res.render('home', { name: req.user.name });
  });

  router.get('/create_room', function (req, res, next) {
    const video_url = req.query.url
    console.log(video_url);
    const video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
    getYoutubeTitle(video_id, function (err, title) {
      db.get('rooms').push({video_url, title, host:req.user.name, host_id:req.user.id, room_id: shortid.generate()}).write();
      res.redirect('/home');
    })  
  });


  router.get('/chat/:id', function (req, res, next) {
    let host = db.get('rooms').find({room_id:req.params.id}).value().host_id;
    let user = req.user.id;
    if(host===user) res.render('hostchat');
    else res.render('memberchat');
  });

  return router;
}