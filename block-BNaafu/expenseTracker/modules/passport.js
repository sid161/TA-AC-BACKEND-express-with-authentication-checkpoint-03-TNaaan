var passport = require('passport');
var githubStrategy = require('passport-github').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/User');

passport.use(new githubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL:"/auth/github/callback"
},(accessToken,refreshToken,profile,done) => {
    console.log(profile);
    var userInfo = {
        email:profile._json.email,
        github:{
            name:profile.displayName,
            username:profile.username,
            photo:profile._json.avatar_url
        }
    }

    User.findOne({email:profile._json.email}, (err,user) => {
        if (err) return done(err)
        if(!user){
            userInfo.name=profile.displayName;
            userInfo.providers=["Github"]
            User.create(userInfo,(err,addedUser) => {
                if(err) return next(err)
                return done(null,addedUser)
            })
        } else{
            if(user.providers.included("Github") || user.github){
                return done({code:503, message:"github account already linked"})
            } user.github={
                name: profile.displayName,
                username:profile.username,
                photo:profile._json.avatar_url
            }
            user.providers.push("Github")
            User.findByIdAndUpdate(user.id,user, (err,updatedUser) =>{
                return done(null,updatedUser)
            })
        }
        return done(null,user);
    })
}))



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret :process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    console.log(profile)

    var userDetails ={

      email :profile._json.email,
      google:{
        image: profile._json.picture,
        name : profile.displayName,
      }
    }

    User.findOne({ email: profile._json.email }, (err, user)=>{
        if(err) return done(err)
        if(!user){
          userDetails.providers=["Google"]
          userDetails.name = profile.displayName;
            User.create(userDetails, (err, addedUser)=>{
                if(err) return done(err)
                return done(null, addedUser);
          });
        } else {
          if(user.providers.includes("Google") || user.google){
              return done({code: 503, message:"Google account already linked"})
            }
            else{
              user.google={
                image: profile._json.picture,
                name : profile.displayName,
              }
              user.providers.push('Google');
              User.findByIdAndUpdate(user.id, user, (err,updatedUser)=>{
                return done(null,updatedUser)
              })
            }
          
          return done(null, user);
        }
      });
    }
  )
);



passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
