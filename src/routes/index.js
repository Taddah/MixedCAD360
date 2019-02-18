var express = require('express');
var router = express.Router();
var auth = require("../controllers/authController.js");
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

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

router.post('/processobjectupload',  upload.single('avatar'), auth.processobjectupload);

app.post('/processobjectupload', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })

module.exports = router;
