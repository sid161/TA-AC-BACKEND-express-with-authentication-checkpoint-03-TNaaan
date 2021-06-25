var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var mongoStore = require('connect-mongo');
require('dotenv').config();
var auth = require('./middlewares/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var incomeRouter = require('./routes/income');
var expenseRouter = require('./routes/expense');


mongoose.connect('mongodb://localhost/expenseCalculator',(err) => {
  console.log(err ? err : "connected to database");
})

require('./modules/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
     store: mongoStore.create({
       mongoUrl: 'mongodb://localhost:27017/expenseCalculator',
     }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.userInfo);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
