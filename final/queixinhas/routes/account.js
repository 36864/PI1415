var express = require('express');
var router = express.Router();
var dbaccess = require('../dbaccess');
/* GET users listing. */
router.get('/', function(req, res, next) {
	//show account management
	res.redirect('login');
	next();
});

router.get('/login', function(req, res, next) {
	res.status(200, {'Content-Type': 'text/html' });
	//if authenticated res.redirect('index');
	//show login form
	res.render('login');
});

router.post('/login', function(req, res, next) {
	//log user in
});

router.get('/register', function(req, res, next) {
	//show registration form
	//if authenticated res.redirect('index');
	res.render('register');
});

router.post('/register', function(req, res, next) {
	//add new user to db
});

router.get('/recover', function(req, res, next) {
	//if authenticated res.redirect('index');
	//show password recovery form
	res.render('recover');
});

router.post('/recover', function(req, res, next) {
	//put password
});

router.get('/logout', function(req, res, next) {
	//log out user, redirect to index
	res.redirect('index');
});

module.exports = router;
