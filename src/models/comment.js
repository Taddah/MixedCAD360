var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var CommentSchema = new Schema({
    idObject: String,
    note: Number,
    comment: String
});

CommentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('comment', CommentSchema);