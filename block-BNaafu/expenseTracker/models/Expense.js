var mongoose = require('mongoose');

var Schema = mongoose.Schema
var expenseSchema = new Schema({
    category:String,
    amount:Number,
    referenceToUser:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true})

var Expense = mongoose.model('Expense',expenseSchema)
module.exports = Expense;