var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 12;

// Mongoose Schema
//reusable so everytime a user saves someting or change pw this would invoke automatically as long we modify it to use

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    //index  unique:true so it only allows one user
    password: {type: String, required: true}
    //if we didn't do this mongoose checks the the inputted data that it will be unique
});

// Called before adding a new user to the DB. Encrypts password.
UserSchema.pre('save', function(next) {
  //stages in mongo (save write the data to the DB);
  //can have pre/post hooks have data manipulation before/after it's saved
  //so before save we are going to do some work on the user and then send it to the DB
    var user = this;

    if(!user.isModified('password')) {
      //we only want to encrpyt the PW one time (other equest and other data we store on their document)
      //we don't want to resave their password
      //saying if they don't have a password lets encrypt it
      return next();
      //express method allows to go to the next MIDDLE WARE
    }
//encryption comes in(pw comes in plain text/string) we use bcrypt to encrypt the text before it saves
//bcrypt is a library used for creating/reading encrypted information
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      //genSalt (we have a string of characters) we will take that string and generate a confusing verison of it
      //or a hash. Meaning if someone accesses or DB they can only access encrypted pw
      //we encrypt it one way
      //SALT_WORK_FACTOR is (goes up to 20) how hard/long do you want the processer to come up with a random set
      //of information. Longer it takes the more secure it is (more processing power);
      //prevents users PW from being overwritten (checks if they already have a PW);
      //if we update the users information and this gets run won't overwrite previous saved PW
        if(err) {
          return next(err);
          //exiting this middleware to go to the next
          //typically when you see next in express it means go to the next stack(middleware)
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
          //take the salt and user.pw (unencrpyted sting at this time)
          //hash is what is creating/generating the PW
            if(err) {
              return next(err);
            }

            user.password = hash;
            next();
        })
    })
});

// Used by login methods to compare login form password to DB password
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  //able to give custom methods to our objects in mongo, takes unencrpyted pw we got and uses bcrypt to hash it again
  // and if it matches something in the DB it will sent back
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      //this.password means this users pw from the database(called from the strategy)
      //candidatePassword is the password from the client side entered object
      //so we compare those two to make sure they match
        if(err) {
          return callback(err);
        }

        callback(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);
