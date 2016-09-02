var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/user');
//schema and models or userModels(that brings it into run)
var path = require('path');

// Handles request for HTML file
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

// Handles POST request with new user data
router.post('/', function(req, res, next) {
    Users.create(req.body, function(err, post) {
         if(err) {
             next(err);
         } else {
             res.redirect('/');
             //redirects the browser back to login page or (/)our homepage
         }
    });
});


module.exports = router;
