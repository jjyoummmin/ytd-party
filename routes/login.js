const express = require('express');
const router = express.Router();
const passport = require('passport');

function successRedirect (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/home');
}

/* GET home page. */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/loginPage' }),successRedirect);

router.get('/facebook', passport.authenticate('facebook', {scope:'email'}));
router.get('/facebook/callback',  passport.authenticate('facebook', { failureRedirect: '/loginPage' }), successRedirect);

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback',  passport.authenticate('kakao', { failureRedirect: '/loginPage' }), successRedirect);

router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback',  passport.authenticate('naver', { failureRedirect: '/loginPage' }), successRedirect);

router.get('/logout', function(req,res){
  req.logout();
  req.session.destroy(function(err){
    res.redirect('/');
  })
});
module.exports = router;
