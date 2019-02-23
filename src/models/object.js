var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectSchema = new Schema({
    imagePath: String,
    username: String,
    objectname: String
});

module.exports = mongoose.model('object', ObjectSchema);