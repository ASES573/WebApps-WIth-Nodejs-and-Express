var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient();
var passport = require('passport');
var bodyParser = require('body-parser');
authRouter.route('/signUp').post(function(req, res) {
	console.log(req.body.username);
	var url = 'mongodb://localhost:27017/libraryApp';
	mongodb.connect(url, function(err, db) {
		var collection = db.collection('users');
		var user = {
			username: req.body.username,
			password: req.body.password
		};
		collection.insert(user, function(err, results) {
			req.login(results.ops[0], function() {
				res.redirect('/auth/profile');
			});
		});
	});
});
authRouter.route('/signIn', bodyParser.urlencoded({
	extended: true
})).post(passport.authenticate('local', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/auth/profile');
});
authRouter.route('/profile')
	.all(function(req, res, next) {
		if (!req.user) {
			res.redirect('/');
		}
		next();
	})
	.get(function(req, res) {
		console.log(req.body);
		//res.json(req.user);
		res.render('auth');
	});
module.exports = authRouter;