var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var commentSchema = new Schema({
    contents: String,
    author: String,
    comment_date: {type: Date, default: Date.now()}
})
 
module.exports = mongoose.model('comment', commentSchema);