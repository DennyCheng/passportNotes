var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Store this user's unique id in the session for later reference
// Only runs during authentication
// Stores info on req.session.passport.user
passport.serializeUser(function(user, done) {
  //stores info on the session (sever side) our user information
  //this session starts when the user information matches
  //whenever we make a request going forward we deseralize the session to make sure it matches
  console.log('serialized: ', user);
  done(null, user.id);
});

// Runs on every request after user is authenticated
// Look up the user's id in the session and use it to find them in the DB for each request
// result is stored on req.user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      done(err);
    }

    console.log('-----------------------------------------------\ndeserialized: ', user.id);
    done(null, user);
  });
});

// Does actual work of logging in
// Called by middleware stack
passport.use('local', new localStrategy({
  //invokes a new localStrategy
  passReqToCallback: true,
  //in order to get req.user
  usernameField: 'username'
  //matches the object we send out
  }, function(req, username, password, done) {
    //at this point hasn't been encrypted yet
    // mongoose stuff
    User.findOne({username: username}, function(err, user) {
      //going to find the user by the username first (if we find the user and then check pw)
      if(err) {
        throw err;
      }

      if(!user) {
        // user not found
        console.log('userStrategy.js :: no user found');
        return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // user object found /found user! Now check their given password against the one stored in the DB
        user.comparePassword(password, function(err, isMatch) {
          if(err) {
            throw err;
          }

          if(isMatch) {
            // all good, populate user object on the session through serializeUser
            console.log('userStrategy.js :: all good');
            return(done(null, user));
          } else {
            // no good.
            console.log('userStrategy.js :: password incorrect');
            done(null, false, {message: 'Incorrect credentials.'});
          }
        });
      } // end else
    }); // end findOne
  } // end callback
));

module.exports = passport;
