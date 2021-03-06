var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var passport = require('./strategies/userStrategy');
var session = require('express-session');
//brings in the new packages (taking specifially these two);

// Route includes
var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

// Passport Session Configuration //
//gives the rules of how we want the format to be made
//when passport processes the rquests we are saying we want req.user to be sent back (vs req.body for bodyparser)
//Server will be sending the cookie data to he browser
//we aren't using a secure certificate that's why it's false
app.use(session({
   secret: 'secret',
   key: 'user',
   //key property establishes how the routes are going to access the data (req.user) user is defined here
  // all the documentations is going to be used req.user
   //middleware manipulates requests (sticks on properties/methods)
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60000, secure: false }
   //how long the cookie want to be around
   //these have our routes (uses this session package)
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', register);
app.use('/user', user);
app.use('/*', index);
//global routes goes to our index

// Mongo Connection //
var mongoURI = "mongodb://localhost:27017/passport";
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
   if(err) {
     console.log("MONGO ERROR: ", err);
   }
   res.sendStatus(500);
});

mongoDB.once('open', function(){
   console.log("Connected to Mongo, meow!");
});

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});
