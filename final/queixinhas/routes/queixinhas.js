var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	//redirect unauthenticated users to index 
	//res.redirect('index');
	//show dashboard to authenticated users
	var user;
	res.writeHead(200, {'Content-Type' : 'html/plain'});
	res.render('dashboard', {user: user.name, user.subscribed});
	next();
});

router.get('/list/:page', function(req, res, next) {
	//redirect unauthenticated users to index 
	//show paged list to authenticated users
	var user;
	var list;
	res.render('list', {list: list, user: user, page: req.params.page});
});

router.get('/:id', function(req, res, next) {
	//show full entry details, including comments
	//add edit link for creator/admin
	//if queixinha doens't exist, 404  next('router');
	var user;
	var queixinha;
	res.render('queixinha', {queixinha: queixinha, user: user);
});

router.get('/new'), function(req, res, next) {
});

router.post('/new'), function(req, res, next) {
});

router.get('/:id/edit'), function(req, res, next) {
});

router.post('/:id/edit'), function(req, res, next) {
});

router.post('/:id/vote'), function(req, res, next) {
	//check user authentication
	//res.redirect('index'); 
	//get vote data from header
	var user;
	//user = db.get(user);
	res.writeHead(200, {'Content-Type':'text/html' });
	res.render('queixinha', {id: req.params.id, voted: user.voted});
});

module.exports = router;

