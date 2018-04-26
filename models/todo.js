var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    todo: String,
    isDone: {type: Boolean, default: false},
    creationDate: {type: Date, default: Date.now}
});

var ToDo = mongoose.model("Todo",todoSchema);

module.exports = ToDo;
