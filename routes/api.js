//db관련 요청 여기서 받기
var express = require('express');
var router = express.Router();

module.exports = (db) => {
  /* GET users listing. */
  router.get('/room_info', function (req, res, next) {
    let room_info = db.get('rooms').value();
    res.json(room_info);
  });

  router.get('/video_id', function (req, res, next) {
    const rid = req.query.rid;         
    let video_url = db.get('rooms').find({ room_id: rid }).value().video_url;
    let video_id = [...video_url.match(/(?<=\?v=).+$/)][0];
    res.end(video_id);
  });
  return router;
}
