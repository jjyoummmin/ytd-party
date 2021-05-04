const express = require('express');
const router = express.Router();
//db (세션저장소로 사용할)
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/session.json', { defaultValue: { sessions: [] } });
const db = lowdb(adapter);
//session
const session = require('express-session')
const LowdbStore = require('lowdb-session-store')(session);
//passport
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const loginConfig = require('../config/login.json');  

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new LowdbStore(db.get('sessions'), {
    ttl: 86400
  }),
}))
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log("serializeuser");
  done(null, user);
});


passport.deserializeUser(function (id, done) {
  console.log("deserializeuser");
  done(null, id);
});

passport.use(new FacebookStrategy(loginConfig.facebook,verifyCallback));
passport.use(new GoogleStrategy(loginConfig.google,verifyCallback));
passport.use(new KakaoStrategy(loginConfig.kakao,verifyCallback));
passport.use(new NaverStrategy(loginConfig.naver,verifyCallback));

  function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile)
    done(null, profile);
  };

  function successRedirect (req, res) {
    // Successful authentication, redirect home.
    console.log("who??",req.user);
    res.redirect('/home');
  }

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("uuu", req.user);
  res.render('login');
});

router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),successRedirect);

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',  passport.authenticate('facebook', { failureRedirect: '/login' }), successRedirect);

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback',  passport.authenticate('kakao', { failureRedirect: '/login' }), successRedirect);

router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback',  passport.authenticate('naver', { failureRedirect: '/login' }), successRedirect);

module.exports = router;
