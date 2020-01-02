var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{type: String, required : true},
    email : {type:String, required: true, unique: true},
    profileName : {type:String, default : null},
    password: {type: String, required :true},
    salt : String,
    phone : {type: String, required :true, unique:true},
    rank:String,
    groupCode:{type:String, default: null}, // 조직 코드를 삽입
    profileImage:String,  // 이미지 url  // multer aws s3
    bookmark: [{
        categoryName:String,
        thumb: String,
        post : [{type: mongoose.Schema.Types.ObjectId, ref: 'post'}],
    }],
    question:{type:String, required: true},
    answer: {type: String, required: true},
    admin: {type:Boolean, default: false},
    refreshToken:{type:String, default: null}
}, { minimize: false })

module.exports = mongoose.model('user',userSchema)