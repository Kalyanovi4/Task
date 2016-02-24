var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, done) {
	done(null, {id: user._id, name: user.fullName, email: user.email});
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use('local-login', new localStrategy(function (email, password, done) {
	// asynchronous verification, for effect...
	process.nextTick(function () {
		// Find user by username.  If there is no user with the given
		// username or the password is not correct, set the user to `false` to
		// indicate failure and set a flash message.  Otherwise return
		// authenticated `user`.
		User.findOne({ email : email }, function(err, user) {
			return err
					? done(err)
					: user
					? user.validPassword(password)
					? done(null, user)
					: done(null, false, { message: 'Incorrect password.' })
					: done(null, false, { message: 'Incorrect username.' });
		});
	});
}));


router.get('/register', function(req, res) {
	if (req.isAuthenticated()) {return res.redirect("/");}

    res.render('register.ejs');
});

router.post('/register', function(req, res) {
	var email = req.body.email;
	var fullName = req.body.fullName;
	var password = req.body.password;
	var rePass = req.body.repassword;
	var bd = req.body.birthDate;
	var gender = req.body.gender;

	if (!email || !fullName || !password || !bd || !gender) {return res.render("register.ejs", {error: "Please pass all register data."});}

	if (password != rePass) {return res.render("register.ejs", {error: "Passwords dont match."});}
	//try to find user with same email in DB
	User.findOne({ email : email }, function(err,user) {
		if (err || user) {
			return res.render("register.ejs", {error: err ? err : "User with this email already exists."});
		}
		//if we dont have this user.
		var newUser = new User({
			email: email,
			password: password,
			gender: gender,
			birthDate: new Date(bd),
			fullName: fullName,
			booksTaken: [],
			booksCreated: []
		});
		//hash password
		newUser.password = newUser.generateHash(password);
		newUser.save(function(err){
			if (err) {return res.render("register.ejs", {error: err});}

			req.logIn(newUser, function(err){
				res.redirect("/");
			});
		})
	});
});

router.get('/login', function(req, res) {
	if (req.isAuthenticated()) {return res.redirect("/");}

	res.render("login.ejs", {
		error: null
	});
});

router.post('/login', function(req, res){
	passport.authenticate('local-login', function(err, user, info){
		if (err || info) {
			res.render("login.ejs", {error: err ? err : info.message});
		}
		else {
			req.logIn(user, function (err) {
				res.redirect("/");
			});
		}
	})(req, res);
});

router.get('/logout', function(req, res) {
	req.logOut();
	res.redirect("/");
});


module.exports = router;