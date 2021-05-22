//db관련 요청 여기서 받기
var express = require('express');
var router = express.Router();
const getYoutubeTitle = require('get-youtube-title');
const shortid = require('shortid');
const apiKey = require('../config/apikey.json');

module.exports = (db) => {
  /* GET users listing. */
  router.get('/room_info_all', function (req, res, next) {
    let room_info = db.get('rooms').value();
    res.json(room_info);
  });

  router.get('/video_id', function (req, res, next) {
    const rid = req.query.rid;         
    let video_url = db.get('rooms').find({ room_id: rid }).value().video_url;
    let video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
    res.end(video_id);
  });

  router.get('/create_room', function (req, res, next) {
    const video_url = req.query.url
    console.log(video_url);
    const video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
    getYoutubeTitle(video_id, apiKey.YOUTUBE, function (err, title) {
      console.log("TITLE", title, "VID", video_id);
      let rid = shortid.generate();
      let new_room = {
        video_url, 
        title, 
        host:req.user.name, 
        host_id:req.user.id, 
        room_id: rid,
        member_count : 1,
      }
      db.get('rooms').push(new_room).write();
      res.redirect(`/chat?rid=${rid}`);
    })  
  });
  return router;
}
