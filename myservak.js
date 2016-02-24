var express = require("express");
var auth = require('./routes/Auth.js');
var books = require('./routes/Books.js');
var api = require('./routes/API.js');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//connect to DB
var mongoose = require('./config/db');
var db = mongoose();
//initialize public path for whole project
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
//set views path as default with views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret: "somesecret"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.user = req.user; // This is important line
    next();
});

app.use('/auth', auth);
app.use('/books', books);
app.use('/testapi', api);

app.get('/', function (req, res) {
    req.isAuthenticated() ? res.redirect("/books") : res.redirect("/auth/login");
});


app.listen(3000, function () {
    console.log("Server started. Listen port 3000");
});