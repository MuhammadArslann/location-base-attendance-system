let mongoose = require('mongoose');

let locationSchema=mongoose.Schema({
    address:String,
    position: {
        lat:Number,
        lng:Number
    }
});
let Location= mongoose.model('location',locationSchema);
module.exports=Location;