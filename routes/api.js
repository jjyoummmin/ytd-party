//db관련 요청 여기서 받기
var express = require('express');
var router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/rooms.json')
const db = low(adapter);

/* GET users listing. */
router.get('/room_info', function(req, res, next) {
  let room_info = db.get('room_info').value();
  res.json(room_info);
});

router.get('/video_id', function(req, res, next) {
  const rid = +req.query.rid;          //string -> number
  let video_url = db.get('room_info').find({room_id:rid}).value().video_url;
  let video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
  res.end(video_id);
});

module.exports = router;
