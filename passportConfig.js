const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const loginConfig = require('./config/login.json');
const shortid = require('shortid');

module.exports = (passport, db) => {
  function register(info) {
    let exist = db.get('members').find({ email: info.email }).value();
    if (exist) return exist;
    let new_user = { ...info, id: shortid.generate() };
    db.get('members').push(new_user).write();
    return new_user;
  }


  function googleCallback(accessToken, refreshToken, profile, done) {
    const info = {
      email: profile._json.email,
      name: profile.displayName
    }
    done(null, register(info));
  };
  function facebookCallback(accessToken, refreshToken, profile, done) {
    const info = {
      email: profile._json.email,
      name: profile.name.givenName + profile.name.familyName
    }
    register(info);
    done(null, register(info));
  };
  function naverCallback(accessToken, refreshToken, profile, done) {
    const info = {
      email: profile._json.email,
      name: profile.displayName
    }
    register(info);
    done(null, register(info));
  };
  function kakaoCallback(accessToken, refreshToken, profile, done) {
    const info = {
      email: profile._json.kakao_account.email,
      name: profile.username
    }
    register(info);
    done(null, register(info));
  };

  passport.serializeUser(function (user, done) {
    console.log("serializeuser");
    done(null, user);
  });


  passport.deserializeUser(function (id, done) {
    console.log("deserializeuser");
    done(null, id);
  });

  loginConfig.facebook.profileFields = ['id', 'emails', 'name'];
  passport.use(new FacebookStrategy(loginConfig.facebook, facebookCallback));
  passport.use(new GoogleStrategy(loginConfig.google, googleCallback));
  passport.use(new KakaoStrategy(loginConfig.kakao, kakaoCallback));
  passport.use(new NaverStrategy(loginConfig.naver, naverCallback));

}