const User = require('../models/User');

module.exports = {
    loggedInUser: (req,res,next) => {
        if(req.session && req.session.userId){
            next();
        } else{
            res.redirect('/')
        }
    },
    userInfo: (req,res,next) => {
        if(!req.session.passport){
        var userId = req.session && req.session.userId;
        if(userId){
            User.findById(userId)
            .populate('incomes expenses')
            .exec((err,user) => {
                if(err) return next(err)

                var totalExpense = user.expenses.reduce((acc,cv) => {
                    acc = acc + cv.amount;
                    return acc;
                },0);
                var totalIncome = user.incomes.reduce((acc,cv) => {
                    acc = acc + cv.amount;
                    return acc;
                },0);
                user.balance = totalIncome - totalExpense
                req.user = user;
                res.locals.user = user;
                return next();
            });

            
        } else{
            req.user = null;
            res.locals.user = null;
            return next();
        }
    }

    if (req.session.passport) {
        var userId = req.session.passport.user;
        User.findById(userId)
        .populate('incomes expenses')
        .exec((err,user) => {
            if(err) return next(err);

            var totalExpense = user.expenses.reduce((acc,cv) => {
                acc = acc + cv.amount;
                return acc;
            },0);

            var totalIncome = user.incomes.reduce((acc,cv) => {
                acc = acc + cv.amount;
                return acc;
            },0);

            user.balance = totalIncome - totalExpense
            req.user = user;
            res.locals.user = user;
            return next(); 
        })
    }
}

}

