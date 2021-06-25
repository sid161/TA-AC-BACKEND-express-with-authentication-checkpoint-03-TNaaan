require('dotenv').config()
var passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        let data = profile._json;
        var profileData = {
          name: data.name,
          email: data.username,
          country: data.location,
          age: 26,
          password: data.twitter_username,
        };
  
        User.findOne({ email: profileData.email }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            User.create(profileData, (err, createdUser) => {
              if (err) return done(err);
              done(null, createdUser);
            });
          }
          done(null, user);
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        let data = profile._json;
        var profileData = {
          name: data.name,
          email: data.sub,
          country: data.locale,
          age: 26,
          password: data.name,
        };
  
        User.findOne({ email: profileData.email }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            User.create(profileData, (err, createdUser) => {
              if (err) return done(err);
              done(null, createdUser);
            });
          }
          done(null, user);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });