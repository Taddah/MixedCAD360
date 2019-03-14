var express = require('express');
var router = express.Router();
var auth = require("../controllers/authController.js");
var multer  = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage: storage});
var Object = require("../models/object");
var UserSchema = require("../models/user");
var Comment = require("../models/comment");

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

router.get('/community', auth.community);

router.get('/form', (req, res, next) => {
  res.render('form');
});

router.post('/objectdetail', (req, res, next) => {
  if(req.user != null){
    Object.findOne({ _id: req.body.objectId}, function (err, objectFound) {
      Comment.find({object: objectFound}, function (err, commentsFound) {
        console.log(commentsFound[0])
        res.render('object_detail', { user : req.user, object : objectFound, comments : commentsFound});
      });
    });
  }
  else
    res.render('login');
});

router.post('/augmentedReality', (req, res, next) => {
  if(req.user != null){
    Object.findOne({ _id: req.body.objectId}, function (err, docs) {
      res.render('ra', { user : req.user, object : docs});
    });
  }
  else
    res.render('login');
});

router.post('/newComment', (req, res, next) => {
  if(req.user != null){

    const newComment = new Comment({
      comment: req.body.comment,
      author: req.user.username,
      object: req.body.idObject
    });

    newComment.save();

   Object.findOne({ _id: req.body.idObject}, function (err, objectFound) {
    if(err) console.log(err);

    objectFound.notes.push(req.body.note);
    var arr = objectFound.notes;

    var total = 0;
    for(var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    var avg = total / arr.length;
    avg = avg.toFixed(1);

    objectFound.average = avg;
    
    objectFound.save(function(err, newObject) {
      if(err) console.log(err);
      Comment.find({object: newObject}, function (err, commentsFound) {
        res.render('object_detail', { user : req.user, object : newObject, comments : commentsFound});
      });
    });
  });
  }
  else
    res.render('login');
})

router.post('/processobjectupload', upload.fields([{ name: 'object', maxCount: 1 },{ name: 'material', maxCount: 1 }]), (req, res, next) => {
  const newObject = new Object({ 
    objectPath: 'uploads/' + req.files.object[0].filename,
    materialPath: 'uploads/' + req.files.material[0].filename,
    username: req.user.username,
    objectname: req.body.objectName,
    note: 0,
    nbComment: 0,
    description: req.body.objectDescription,
    timestamp: Date.now()
    });

  newObject.save();

  UserSchema.findOneAndUpdate({ username: req.user.username }, { $inc: { objects: 1 } }, {new: true },function(err, response) {
    if (err) return res.send(500, { error: err });
  });

  res.redirect('/myObjects');
});

module.exports = router;
