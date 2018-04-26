var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    text: {required: true, type:String},
    title: {required:true, type:String},
    author: {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        fors:String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    created:{type: Date,default: Date.now},
    category:String,
    image: {type: String, default: ""},
    votes:{type: Number, default:0},
    voters:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]

});

module.exports = mongoose.model('Blog',blogSchema);