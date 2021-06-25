var express = require('express');
var User = require('../models/User');
var Expense = require('../models/Expense');
var Income = require('../models/Income');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// userRegistrationform get

router.get('/register',(req,res) => {
  res.render('userRegistrationForm.ejs');
})

router.post('/register', (req,res,next) => {
  User.create(req.body,(err,created) => {
    if(err) return next(err)
    res.redirect('/users/login')
  })
})

//user login
router.get('/login',(req,res) => {
  res.render('userLoginForm.ejs');
})

router.post('/login',(req,res,next) => {
  var {email,password} = req.body;
  if(!email||!password){
    return res.redirect('/users/login');
  }
  User.findOne({email},(err,user) => {
    if(err) return next(err)
    if(!user){
      return res.redirect('/users/login');
    }
    user.verifyPassword(password,function(err,result){
      if(err) return next(err)
      if(!result){
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/home');
    })
  })
})

//logout 
router.get('/logout',(req,res,next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})

// get balance

router.get('/balance/all',(req,res,next) => {
  let arrbal  = req.user.incomes.concat(req.user.expenses);
  arrbal = arrbal.sort((a,b) => {
    if(a.date > b.date){
      return 1;
    }
    if(a.date < b.date){
      return -1
    }
    if(a.date = b.date){
      return 0;
    }
  })
  
  let monthlyBal = req.user.balance;
  res.render('balDetails',{arrbal,monthlyBal})

})

// filter by date

router.post('/balance/dateFilter', (req,res,next) => {
  var {from, to} = req.body;
  Expense.find({date : {$gte: from, $lt: to}},(err,expenseFilter) => {
    if(err) return next(err)
    Income.find({date: {$gte: from, $lt:to}},(err,incomeFilter) => {
      if(err) return next(err)

      // for savings

      let monthlyExpense = expenseFilter.reduce((acc,cv) => {
        acc = acc + cv.amount;
        return acc;
      },0);
      let monthlyIncome = incomeFilter.reduce((acc,cv) => {
        acc = acc + cv.amount;
        return acc;
      },0)

      var monthlyBal = monthlyIncome - monthlyExpense;

      var arrbal = incomeFilter.concat(expenseFilter);
      arrbal = arrbal.sort((a,b) => {
        if(a.date > b.date){
          return 1;
        }
        if(a.date < b.date){
          return -1;
        }
        if(a.date = b.date){
          return 0;
        }
      });
      res.render('balDetails', {arrbal, monthlyBal});
    })
  })
})

router.post('/balance/byMonth', (req, res, next) => {
  let month = req.body.month;
  let startDate = month + '-01';

  let arr = month.split('-');

  arr[1] = Number(arr[1]) + 1;
  arr[1] = arr[1].toString();

  if (arr[1].length < 2) {
    arr[1] = '0' + arr[1];
  }

  arr.push('01');

  let endDate = arr.join('-');
  Expense.find(
    { date: { $gte: startDate, $lt: endDate } },
    (err, expenseArr) => {
      if (err) return next(err);

      Income.find(
        { date: { $gte: startDate, $lt: endDate } },
        (err, incomeArr) => {
          if (err) return next(err);
          //caculating saving of month
          let monthlyExpense = expenseArr.reduce((acc, cv) => {
            acc = acc + cv.amount;
            return acc;
          }, 0);
          let monthlyIncome = incomeArr.reduce((acc, cv) => {
            acc = acc + cv.amount;
            return acc;
          }, 0);
          let monthlyBal = monthlyIncome - monthlyExpense;

          let arrbal = incomeArr.concat(expenseArr);
          arrbal = arrbal.sort(function (a, b) {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
            if ((a.date = b.date)) {
              return 0;
            }
          });

          res.render('balDetails', { arrbal, monthlyBal });
        }
      );
    }
  );
});

router.use("/balance/bysource",(req,res) => {
  var source = req.body.source;
  Income.find({source}, (err,sourceInc) => {
    if(err) return next(err)
    
  })
})


module.exports = router;
