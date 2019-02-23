var express = require('express');
var router = express.Router();
var auth = require("../controllers/authController.js");
var multer  = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage: storage});
var Object = require("../models/object");
var UserSchema = require("../models/user");

// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

router.get('/myObjects', auth.myObjects);

/*
router.post('/objectdetail', (req, res, next) => {
  if(req.user != null){
    console.log('res = ' + req.body.test);
    Object.find({ _id: req.body.objectId}, function (err, docs) {
      res.render('object_detail', { user : req.user, object : docs});
    });
  }
  else
    res.render('login');
});*/

router.post('/objectdetail', (req, res, next) => {
  if(req.user != null){
    Object.findOne({ _id: req.body.objectId}, function (err, docs) {
      console.log(docs);
      res.render('object_detail', { user : req.user, object : docs});
    });
  }
  else
    res.render('login');
});

router.post('/processobjectupload', upload.single('file'), (req, res, next) => {
  
  const newObject = new Object({ 
    imagePath: 'uploads/ ' + req.file.filename,
    username: req.user.username,
    objectname: req.body.objectName });

  newObject.save();

  UserSchema.findOneAndUpdate({ username: req.user.username }, { $inc: { objects: 1 } }, {new: true },function(err, response) {
    if (err) return res.send(500, { error: err });
  });

  res.render('my_objects', { user : req.user });
});

module.exports = router;
