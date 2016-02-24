// load the things we need
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
var _ = require("underscore");
// define the schema for our user model
var userSchema = mongoose.Schema({
    email: {
        type : String , unique : true
    },
    password: String,
    gender: String,
    birthDate: Date,
    fullName: String,
    booksTaken: Array,
    booksCreated: Array
});

userSchema.methods.generateHash = function(password) {
    return password;
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return this.password == password;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);