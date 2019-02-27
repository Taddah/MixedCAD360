var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectSchema = new Schema({
    objectPath: String,
    materialPath: String,
    username: String,
    objectname: String,
    timestamp: String
});

module.exports = mongoose.model('object', ObjectSchema);