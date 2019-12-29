var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{type: String, required : true},
    email : {type:String, required: true, unique: true},
    password: {type: String, required :true},
    salt : String,
    phone : {type: String, required :true},
    rank:String,
    groupCode:String, // 조직 코드를 삽입
    profileImage:String,  // 이미지 url  // multer aws s3
    bookmark: [{
        categoryName:String,
        // thumb:[String],
        post : [{type: mongoose.Schema.Types.ObjectId, ref: 'post'}],
    }],
    question:{type:String, required: true},
    answer: {type: String, required: true},
    admin: Boolean
}, { minimize: false })

module.exports = mongoose.model('user',userSchema)