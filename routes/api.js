//db관련 요청 여기서 받기
var express = require('express');
var router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter);

//initial db settings;
(function(){
  const room_info = [{
    video_url: 'https://www.youtube.com/watch?v=W4vzZbAvyDY',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '또리',
    room_id : 1,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=u5WK5nU0-Dk',
    title: '가난해야 예술한다고? 자기만의 방과 500파운드의 의미 | 버지니아 울프의 삶과 작품 세계',
    host: '용남',
    room_id : 2,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=wSw7Dpoc3rI',
    title: '(ENG) 저 목욕하는 펭귄입니다. [EP.181]',
    host: '민수',
    room_id : 3,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=XmDJDiM7HG8',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '수은',
    room_id : 4,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=lGXJoGLeLn0',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '찬혁',
    room_id : 5,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=SYIEFsP8Hy0',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '수현',
    room_id : 6,
  },
  {
    video_url: 'https://www.youtube.com/watch?v=CyelIVCa-5Q',
    title: 'Tiny desk concert | Fly me to the moon☽ with penguin🚀',
    host: '폴킴',
    room_id : 7,
  }];
  db.defaults({room_info}).write();
})();


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
