var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Books = require('../models/book');

router.get('/all', function(req,res){
    if (!checkKey(req.query.apikey)) {return res.send(JSON.stringify({err: "auth failed"}));}
    Books.find().exec(function(err, docs){
        res.send(JSON.stringify(docs));
    });
});

router.get('/takenBy', function (req, res) {
    if (!checkKey(req.query.apikey)) {return res.send(JSON.stringify({err: "auth failed"}));}
    Books.find({takenBy: {$ne: ""}}).exec(function(err, docs){
        res.send(JSON.stringify(docs));
    });
});

router.get('/available', function (req, res) {
    if (!checkKey(req.query.apikey)) {return res.send(JSON.stringify({err: "auth failed"}));}
    Books.find({takenBy: ""}).exec(function(err, docs){
        res.send(JSON.stringify(docs));
    });
});

router.get('/createdBy', function (req, res) {
    if (!checkKey(req.query.apikey)) {return res.send(JSON.stringify({err: "auth failed"}));}
    Books.find({createdBy: req.query.email}).exec(function(err, docs){
        res.send(JSON.stringify(docs));
    });
});

router.get('/name', function (req, res) {
    console.log(req.query);
    if (!checkKey(req.query.apikey)) {return res.send(JSON.stringify({err: "auth failed"}));}
    Books.find({name: req.query.name}).exec(function(err, docs){
        res.send(JSON.stringify(docs));
    });
});

module.exports = router;

function checkKey(key) {
    var myapikey = "secretkey";
    return key == myapikey;
}