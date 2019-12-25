var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name:{type: String, required : true}, //네이버.. 다음
    phone : {type: String, required :true}, // 010-5409-9859 
    department: String, // 직무 마케팅, 개발..
    category:[String],
    groupImage:String,
    groupCode:{type:String, unique:true} // 처음엔 null값이었다가 조직 생성 완료되면 코드 삽입
})
module.exports = mongoose.model('group',groupSchema)
//이름 이메일 조합 jwt 토큰 생성