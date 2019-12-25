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
    comments : String,
    category : String,
    writer : String,
    groupCode : String,
    postDate: {type: Date, default: Date.now()},
},{ versionKey:'_somethingElse'})

module.exports = mongoose.model('post',postSchema)