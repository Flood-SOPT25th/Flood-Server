var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name:{type: String, required : true}, //네이버.. 다음
    phone : {type: String, required :true}, // 010-5409-9859 
    department: String, // 직무 마케팅, 개발..
    category:[String],
    groupImage:String,
    groupCode:{
        type:String, 
        unique:true
    }
})
module.exports = mongoose.model('group',groupSchema)
