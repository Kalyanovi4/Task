mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect("mongodb://localhost/todos");
    return db;
};