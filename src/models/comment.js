var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: String,
    object: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Object'
    }
});

module.exports = mongoose.model('comment', CommentSchema);