var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({
    image: String,
    postImages : [String],
    postContent : String,
    title: String,
    description: String,
    url: String,
    see: {type:Number, default: 0},
    bookmark : {type:Number, default: 0},  
    score : {type:Number, default: 0},  
    comments_count : {type:Number, default: 0},
    category : String,
    writer : String,
    writer_email : String,
    profileImage : String,
    bookmark_list : [String],
    bookmarked : Boolean,
    groupCode : String,
    postDate: {type: Date, default: Date.now()},
    comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
},{ versionKey:'_somethingElse'})

module.exports = mongoose.model('post',postSchema)