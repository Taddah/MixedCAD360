var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var Object = require("../models/object");


var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

// Restrict access to myObjects page
userController.myObjects = function(req, res) {
  if(req.user != null){
    Object.find({ username: req.user.username}, function (err, docs) {
      res.render('my_objects', { user : req.user, objects : docs});
    });
  }
  else
    res.render('login');
};

// Restrict access to community page
userController.community = function(req, res) {
  if(req.user != null){
    Object.find({ }, function (err, docs) {
      res.render('community', { user : req.user, objects : docs});
    });
  }
  else
    res.render('login');
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, objects : 0 }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;