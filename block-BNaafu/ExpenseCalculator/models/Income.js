var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var incomeSchema = new Schema(
  {
    source: { type: String, require: true },

    date:  Date ,
    amount: Number,
    type: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

var Income = mongoose.model('Income', incomeSchema);

module.exports = Income;