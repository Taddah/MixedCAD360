var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: String,
    password: String,
    objects: Number,
    mail: String,
    credit: Number,
    profilPicture: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);