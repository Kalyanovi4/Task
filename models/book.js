// load the things we need
var mongoose = require('mongoose');
var _ = require("underscore");

var bookSchema = mongoose.Schema({
    name: {
        type : String , unique : true
    },
    author: String,
    info: String,
    created: Date,
    createdBy: String,
    status: String,
    takenBy: String,
    imgLink: String
});


// create model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);