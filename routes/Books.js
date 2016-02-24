var express = require('express');
var router = express.Router();
var Book = require("../models/book");
var User = require("../models/user");
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });

router.get('/', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	res.render("main.ejs");
});

router.get('/add', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}

	res.render("add_book.ejs");
});

router.post('/add', upload.single('image'), function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}

	var name = req.body.bookname;
	var author = req.body.author;
	var info = req.body.info;

	if (!name || !author || !info) {return res.render("add_book.ejs", {error: "Please fill in all book data."});}

	var newBook = new Book({
		name: name,
		author: author,
		info: info,
		created: new Date(),
		createdBy: req.user.email,
		status: "available",
		takenBy: "",
		imgLink: "/img/" + req.file.originalname
	});
	newBook.save(function(err){
		if (err) {return res.render("add_book.ejs", {error: err});}

		fs.readFile(req.file.path, function(err, data){
			if (err) {console.log(err); return res.render("add_book.ejs", {error: err})}

			fs.writeFile("./public/img/" + req.file.originalname, data, function(err){
				if (err) {console.log(err); return res.render("add_book.ejs", {error: err})}

				res.render("add_book.ejs", {info: "All OK"})
			});
		});
	});
});

router.get('/edit', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.find({createdBy:req.user.email}, {_id: 0}, function(err, books){
		res.render("edit_books.ejs", {error: err, books: books});
	});
});

router.get('/editform', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.findOne({$and: [{name: req.query.name, createdBy: req.user.email}]}, function(err, bookdata){
		res.render("edit_form.ejs", {error: err, book: bookdata});
	})
});

router.post('/editform', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	var name = req.body.bookname;
	var author = req.body.author;
	var info = req.body.info;
	Book.findOne({"name": req.body.oldname}, function (err, book) {
		book.name = name;
		book.author = author;
		book.info = info;
		book.save(function(err){
			if (err) {
				console.log(err);
			}
			res.redirect("/books/edit");
		});
	});
});

router.get('/all', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.find({}, {_id: 0}, function (err, books) {
		res.render("all_books.ejs", {error: err, books: books});
	});
});

router.post('/take_button', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.findOne({"name": req.body.take}, function (err, book) {
		book.status = "taken";
		book.takenBy = req.user.email;
		book.save(book, function (err, result) {
			User.findOne({ email : req.user.email }, function(err,user) {
				user.booksTaken.push(req.body.take);
				user.save(function(err){
					res.redirect('back');
				});
			})
		});
	});
});

router.get('/availiable', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.find({status:"available"}, {_id: 0}, function(err, books){
		res.render("available_books.ejs", {error: err, books: books});
	});
});

router.get('/taken', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	Book.find({status:"taken"}, {_id: 0}, function(err, books){
		res.render("taken_books.ejs", {error: err, books: books});
	});
});

router.post('/delete', function(req, res) {
	if (!req.isAuthenticated()) {return res.redirect("/auth/login");}
	var bookName = req.body.name;
	Book.remove({name: bookName}, function(err){
		var msg = err ? "Failed" : "Ok";
		res.send({status: msg});
	});
});


module.exports = router;