var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Store this user's unique id in the session for later reference
// Only runs during authentication
// Stores info on req.session.passport.user
//this is implcitally called (how passport flows automatically) this is ran after user is authenciated/confirmed
//bounces here after the user confirmation is sent back from the DB with a success
passport.serializeUser(function(user, done) {
  //stores info on the session (sever side) our user information
  //this session starts when the user information matches
  //whenever we make a request going forward we deseralize the session to make sure it matches
  console.log('serialized: ', user);
  done(null, user.id);
  //the session information (we are storing the user.id mongo id) could store something else
});

// Runs on every request after user is authenticated
// Look up the user's id in the session and use it to find them in the DB for each request
// result is stored on req.user(on user.js)
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
  //invokes a new local Strategy (can change this based on what strategy i used (google));
  //matches from the 'local' respones being called
  passReqToCallback: true,
  //in order to get req.user
  usernameField: 'username'
  //matches the object we send out
  //this has to reflect what object is being sent in
  }, function(req, username, password, done) {
    //at this point hasn't been encrypted yet
    // mongoose stuff first
    User.findOne({username: username}, function(err, user) {
      //going to find the user by the username first (if we find the user and then check pw)
      //findOne mongoose method
      if(err) {
        //if username isn't found/error
        throw err;
      }

      if(!user) {
        // user not found/pw isn't correct
        console.log('userStrategy.js :: no user found');
        return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // user object found /found user! Now check their given password against the one stored in the DB
        user.comparePassword(password, function(err, isMatch) {
          //comparePassword is written on the schema/that we defined
          //can be used since user is is the information we got from the server
          //and comparePassword will compare the client object and server object to make sure they match
          //user. at this point is user object from the findOne (from the database)
          if(err) {
            throw err;
          }

          if(isMatch) {
            // all good, populate user object on the session through serializeUser
            console.log('userStrategy.js :: all good');
            return(done(null, user));
            //null is the spot for err
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
