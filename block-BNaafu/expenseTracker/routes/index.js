var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/success', (req,res) => {
  res.render("success");
})

router.get('/failure',(req,res) => {
  res.render("failure");
})

router.get('/auth/github',passport.authenticate('github'));

router.get('/auth/github/callback',passport.authenticate("github", {failureRedirect: "/failure"}), (req,res) => {
  res.redirect('/success');
})

router.get('/auth/google',passport.authenticate('google', {scope: ['openid','email','profile']}));

router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/failure'}),(req,res) => {
  res.redirect('/success');
})

router.get('/register',(req,res) => {
  res.render('register');
})

router.get('/login',(req,res) => {
  res.render('login');
})

router.post('/register',(req,res,next) => {
  var {email ,password} = req.body;
  if(password.length < 4){
    return res.redirect('/register');
  }
  User.create(req.body, (err,user) => {
    if(err) return next(err)
    res.redirect('/login');
  })
})

router.post('/login',(req,res,next) => {
  var {email,password} = req.body;
  if(!email || !password){
    return res.redirect('/login')
  }
  User.findOne({email},(err,user) => {
    if(err) return next(err)
    if(!user){
      return res.redirect('/login');
    }
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err)
      if(!result){
        res.redirect('/login');
      }
      req.session.userId = user.id;
      res.redirect('/onboarding');
    })
  })
})

//logout
router.get('/logout', (req,res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
})

module.exports = router;
