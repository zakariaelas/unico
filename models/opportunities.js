const mongoose = require("mongoose");

var opportunitySchema = new mongoose.Schema({
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String,
        fors: String
    },
    title: {type : String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    requirement: {type:String, required:true},
    oppType: {type: String, required:true},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    created : {type: Date, default: Date.now},
    votes:{type: Number, default:0},
    voters:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
});

module.exports = mongoose.model('Opportunity',opportunitySchema,'opportunities');