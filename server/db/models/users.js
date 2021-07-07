let mongoose = require('mongoose');

let userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    cnic:String,
    type:String,
    pics: [String],
    locations:[String]
});
let Users= mongoose.model('user',userSchema);
module.exports=Users;