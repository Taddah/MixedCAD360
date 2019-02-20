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
var upload = multer({storage: storage, 
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(fbx|obj)$/)) {
        return cb(new Error('Only 3D object files are allowed!'));
    }
    cb(null, true);
  }
});
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/mixedcad360';

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

router.get('/uploadObject', auth.uploadObject);

router.post('/processobjectupload', upload.single('file'), (req, res, next) => {
  if(err) res.render('upload_object', { user : req.user });

    MongoClient.connect(url, (err, db) => {
        assert(null, err);

        //Ajout du chemin de l'objet dans la BDD (+ autres infos)
        db.collection('objects').insertOne(
          {'imagePath' : 'uploads/' + req.file.filename, 
          'username' : req.user.username,
          'objectName': req.body.objectName }, 
          (err, result) => {
            if ( err ) throw err;
        });

        //Update de l'user (nombre d'objet)
        db.collection( 'users' ).update (
          { username : req.user.username },
          { $inc : { objects:1 } },
          function( err, result ) {
              if ( err ) throw err;
        });
    });
    res.render('index', { user : req.user });
});

module.exports = router;
