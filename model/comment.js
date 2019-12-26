var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var commentSchema = new Schema({
    // upComment : { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
    content: String,
    subComment : [Object],
    writer: String,
    profileImage : String,
    comment_date: {type: Date, default: Date.now()}
})
 
module.exports = mongoose.model('comment', commentSchema);