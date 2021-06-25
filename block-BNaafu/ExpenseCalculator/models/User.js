var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema
var userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    age:  Number,
    phone:  Number ,
    country:  String ,
    password:  String,
    incomes: [{ type: mongoose.Types.ObjectId, ref: 'Income' }],
    expenses: [{ type: mongoose.Types.ObjectId, ref: 'Expense' }],
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hashed) => {
    if (err) return next(err);

    this.password = hashed;
    return next();
  });
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};


let User = mongoose.model('User', userSchema);

module.exports = User;