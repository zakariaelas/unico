const mongoose = require('mongoose');

var videoconferenceSchema = new mongoose.Schema({
    author:{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    topic: String,
    link: String,
    category: [String]
});

module.exports = mongoose.model('Videoconference',videoconferenceSchema);