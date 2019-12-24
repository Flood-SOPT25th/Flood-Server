var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({
    image: String,
    postImages : [String],
    postTitle : String,
    postContent : String,
    title: String,
    description: String,
    url: String,
    see: [String],
    bookmark : [String], 
    comments : String,
    writer : String,
    postDate: {type: Date, default: Date.now()},
},{ versionKey:'_somethingElse'})

module.exports = mongoose.model('post',postSchema)