const express = require('express');
const router = express.Router();
const {validateLoggedIn, validateNogLoggedIn} = require('./authMiddleware.js');

module.exports = (db) => {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('welcome');
  });

  router.get('/loginPage', validateNogLoggedIn, function(req, res, next) {
    res.render('loginPage');
  });

  router.get('/home', validateLoggedIn, function (req, res, next) {
    res.render('home', { name: req.user.name });
  });


  router.get('/chat', validateLoggedIn , function (req, res, next) {
    const rid = req.query && req.query.rid;
    if(!rid){
      res.send('전달된 방 아이디가 없습니다.')
    }else{
      let host = db.get('rooms').find({room_id:rid}).value().host_id;
      let user = req.user.id;
      console.log("user", req.user);
      if(host===user) res.render('hostchat', { name: req.user.name });
      else res.render('memberchat', { name: req.user.name});
    }
   
  });

  return router;
}