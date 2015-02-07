var express = require('express');
var router = express.Router();
var db = require('.././dbaccess');


router.use(function(req, res, next) {
	console.log('USER: ' + req.user);
	if(!/^\/\d+$/.test(req.url)){
		if(!req.user) return next('router');
		
	}
	return next();
});

router.get('/', function(req, res, next) {
	res.writeHead(200, {'Content-Type' : 'html/plain'});
	db.get
	return res.render('dashboard', {user: req.user});
});

router.get('/list/:page', function(req, res, next) {
	//redirect unauthenticated users to index 
	//show paged list to authenticated users	
	db.getQueixinhas(req.params.page, function(err, list){
		if(err) next('route');
		return res.render('list', {list: list, user: user, page: req.params.page});	
	});
	
});

router.get('/:id', function(req, res, next) {
	console.log('GOT TO ID PAGE');
	console.log(req.user);
	if(!req.user) req.user.username = '';
	db.getUser(req.user.username, function(err, user){
		console.log('GOT USER');
		db.getQueixinha(req.params.id, function(err, queixa){
			if(err) {
				res.flash(err);
				res.redirect('/');
			}
			console.log('GOT QUEIXINHA' );
			console.log(err + ' ; ' + queixa + ' ; ' + user);
			res.render('queixinha', {queixinha: queixa, user: user});
	});
	});
});

router.get('/new', function(req, res, next) {
	
	res.writeHead(200, {'Content-Type':'text/html' });
	return res.render('novaqueixinha');
});

router.post('/new', function(req, res, next) {
	var queixa = new db.queixinha(null, req.body.title, req.body.desc, req.user, null, null, req.body.geo, null, req.body.categorias);
	
	if(queixa.titulo = "") {
		res.flash('Título não pode ser vazio');
		res.render('/new', queixa);
	}
	access.newQueixinha(queixa, new function(err, queixa) {
			res.redirect('/' + queixa.id);
		});
	
});

router.get('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa){
		if(queixa.autor.username !== req.user.username)	return res.redirect('/' + req.params.id);
		
		res.writeHead(200, {'Content-Type':'text/html' });
		return res.render('/edit', {queixinha:queixa, user:req.user});
	});
});

router.post('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa) {
		db.getUser(req.user.username, function(err, user) {
			if(!user.gestor && queixa.autor.username !== req.user.username) return res.redirect('/' + req.params.id);
			var queixaEdit = new db.queixinha(null, req.body.title, req.body.desc, req.user, null, null, req.body.geo, null, req.body.categorias, req.body.closed);
			if(queixaEdit.titulo = "") {
				res.flash('Título não pode ser vazio');
				res.render('/' + req.params.id + '/new', queixa);
			}
			queixa.title = queixaEdit.title;
			queixa.desc = queixaEdit.desc;
			queixa.closed = queixaEdit.closed;
			db.editQueixinha(queixa, req.body.comment, user);
			
			res.writeHead(200, {'Content-Type':'text/html' });
			return res.render('/' + req.params.id);
		});
	});
});

router.post('/:id/vote', function(req, res, next) {
	db.getUser(req.user.username, function(err, user){
		db.getQueixinha(req.params.id, function(err, queixa){
			
		res.writeHead(200, {'Content-Type':'text/html' });
		res.render('queixinha', {queixa: queixa, voted: user.voted});
		});
	});
});

module.exports = router;

