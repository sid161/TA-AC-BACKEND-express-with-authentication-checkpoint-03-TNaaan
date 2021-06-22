var express = require('express');
var mongoose = require('mongoose');

var User = require('../models/User');
var Income = require('../models/Income');
var Expense = require('../models/Expense');

router.get('/create',(req,res) => {
    var {userId} = req.session;
    User.findById(id,(err,user) => {
        if(err) return next(err)
        return res.render('createIncome');
    })
})

router.post('/create',(req,res,next) => {
    var {userId} = req.session;
    User.findById(id,(err,user) => {
        if(err) return next(err)
        Income.create(req.body,(err,user) => {
            if(err) return next(err)
            
        })
    })
})