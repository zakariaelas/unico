const mongoose=require('mongoose');

var noteSchema = mongoose.Schema({
    subject: {type: String, required: true},
    text: {
        type:String,
        default:""
    }
});

module.exports = mongoose.model('Note',noteSchema);