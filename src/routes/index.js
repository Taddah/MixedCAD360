var express = require('express');
var router = express.Router();
var auth = require("../controllers/authController.js");
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage: storage});
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
  
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        insertDocuments(db, 'uploads/' + req.file.filename, req.user.username, () => {
            db.close();
        });
    });
    res.render('index', { user : req.user });
});

var insertDocuments = function(db, filePath, username, callback) {
  var collection = db.collection('objects');
  collection.insertOne({'imagePath' : filePath, 'username' : username }, (err, result) => {
      assert.equal(err, null);
      callback(result);
  });
}

module.exports = router;
