var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");


var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

// Restrict access to myObjects page
userController.myObjects = function(req, res) {
  if(req.user != null)
    res.render('my_objects', { user : req.user });
  else
    res.render('login');
};

userController.uploadObject = function(req, res){
  if(req.user != null)
    res.render('upload_object', { user : req.user });
  else
    res.render('login');
}

userController.processobjectupload = function(req, res){
  console.log(req.file);
}

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