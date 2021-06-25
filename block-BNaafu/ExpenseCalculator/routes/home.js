
var express = require('express');
const { loggedInUser } = require('../middlewares/auth');
const Expense = require('../models/Expense');
var Income = require('../models/Income');
var router = express.Router();
var auth = require('../middlewares/auth');


router.get('/',auth.loggedInUser,(req,res,next) => {
  Income.find({},(err,income) => {
    if(err){
      next(err)
    } else{
      Expense.find({},(err,expense) => {
        if(err){
          next(err);
        } else{
          res.render('home',{income,expense})
        }
      })
    }
  })
})


module.exports = router;