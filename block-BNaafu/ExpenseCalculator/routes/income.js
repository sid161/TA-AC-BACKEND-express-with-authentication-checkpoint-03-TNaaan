var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var Income = require('../models/Income');
var Expense = require('../models/Expense');
var router = express.Router();



router.get('/new',(req,res) => {
    res.render('createIncome.ejs');
})
router.post('/new', (req, res, next) => {
    let data = req.body;
    data.createdBy = req.user._id;
    Income.create(data, (err, created) => {
      if (err) return next(err);
      User.findByIdAndUpdate(
        req.user.id,
        { $push: { incomes: created.id } },
        (err, user) => {
          if (err) return next(err);
          res.redirect('/home');
        }
      );
    });
  });



module.exports = router;