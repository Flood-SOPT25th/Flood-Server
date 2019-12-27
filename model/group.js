var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name:{type: String, required : true}, 
    phone : {type: String, required :true}, 
    department: String,
    category:[String],
    groupImage:String,
    groupCode:{
        type:String, 
        unique:true
    }
})
module.exports = mongoose.model('group',groupSchema)
