var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var expenseSchema = new Schema(
  {
    source: { type: String, require: true },
    category: [{ type: String }],
    date: Date ,
    amount:  Number ,
    type: { type: String },
    createdBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

var Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;