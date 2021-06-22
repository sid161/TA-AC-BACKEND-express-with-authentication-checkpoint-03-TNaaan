var mongoose = require('mongoose');
var User = require('../models/User');
var  Expense = require('../models/Expense');

var Schema = mongoose.Schema
var incomeSchema = new Schema({
    source:[String],
    amount:Number,
    referenceToUser: {type:Schema.Types.ObjectId,ref:"User"}
    
},{timestamps:true})

var Income = mongoose.model('Income',incomeSchema);
module.exports = Income;