let mongoose = require('mongoose');
// this is the location file related to database
let locationSchema=mongoose.Schema({
    address:String,
    position: {
        lat:Number,
        lng:Number
    }
});
let Location= mongoose.model('location',locationSchema);
module.exports=Location;