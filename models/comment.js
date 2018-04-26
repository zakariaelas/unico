const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String,
        fors: String
    },
    text: String,
    created:{type:Date,default:Date.now} 
});

module.exports = mongoose.model('Comment',commentSchema);