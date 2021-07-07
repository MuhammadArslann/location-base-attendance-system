let mongoose = require('mongoose');

let visitSchema = mongoose.Schema({
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:"user"
    },
    location:String,
    verified:false,
    date:String,
    locationName:String
});

let Visits = mongoose.model('visit', visitSchema);
module.exports = Visits;