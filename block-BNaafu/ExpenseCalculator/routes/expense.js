var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var Income = require('../models/Income');
var Expense = require('../models/Expense');
var router = express.Router();

router.get('/new',(req,res,next) => {
    res.render('createExpense.ejs');
});

router.post('/new',(req,res,next) => {
    var data = req.body;
    data.createdBy = req.user_id;  // for the identity of user/client
    var cat = data.category.split(' ');
    data.category = cat;
    Expense.create(data,(err,created) => {
        if(err) return next(err)
        User.findByIdAndUpdate(req.user.id,{$push: {expenses: created.id}},(err,user) => {
            if(err) return next(err)
            res.redirect('/home');
        })
    }) 
})

module.exports = router;