var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github',{failureRedirect: '/users/login'}), (req,res) => {
    res.redirect('/home');
  })

  //route for google
  router.get('/auth/google',passport.authenticate('google', {scope: ['profile']}));

  router.get('/auth/github/callback',passport.authenticate('google', {failureRedirect:'/users/login'}),(req,res) => {
    res.redirect('/home');
  })

module.exports = router;
