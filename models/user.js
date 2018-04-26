const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    bio:String,
    fors:String,
    university: {type: String, default:""},
    location: {type: String, default:""},
    degree: {type: String, default:""},
    googlelink: {type: String, default:""},
    linkedlink: {type: String, default:""},
    fblink:{type: String, default:""},
    todos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Todo'
    }],
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Note'
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);