var express = require('express');
var router = express.Router();
var db = require('.././dbaccess');
var regex_single = /^\/\d+$/;
var regex_list = /^\/(\?page=\d*|$)$/;

router.use(function(req, res, next) {
	console.log('serving ' + req.url + ' to ' + req.user);
	
	if(!regex_single.test(req.url) && !regex_list.test(req.url)){		
	if(!req.user.username){
		console.log('REDIRECTING');
		return res.redirect('/queixinhas');
	}
	}
	return next();
});

router.get('/', function(req, res, next) {
	var page = 1;
	if(req.query.page){
		if(req.user.username)
			page = req.query.page;
	}
	console.log('SERVING LIST PAGE ' + page);
	db.getQueixinhas(page, function(err, list){		
		if(err) {
			console.log(err);
			return next(err);
		}
		db.getUser(req.user.username, function(err, user){
			if(err) {
				return next(err);
			}
			return res.render('queixinhas', {list: list, user: req.user, page: page});
		});
	});

});

router.get('/dashboard', function(req, res, next) {
	db.getQueixinhasUtilizador(req.user.username, function(err, queixasbyuser){
		if(err) {
			console.log(err);
			return next(err);
		}
		db.getQueixinhasbyIntUser(req.user.username, function(err, interest){
			if(err) { 
				console.log(err);
				return next(err);
			}
			res.writeHead(200, {'Content-Type' : 'html/plain'});
			return res.render('dashboard', {user: req.user, queixasUser : queixasbyuser, queixasInterested:interest});
		});	
	});
});

router.get('/:id', function(req, res, next) {
	if(!req.user) req.user.username = '';
	db.getUser(req.user.username, function(err, user){
		if(err) console.log('ERROR : ' + err);
		db.getQueixinha(req.params.id, function(err, queixa){
			if(err) console.log('ERROR : ' + err);
			if(err) {
				res.flash(err);
				return res.redirect('/');
			}
			return res.render('queixinha', {queixinha: queixa, user: user});
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
		return res.render('/new', queixa);
	}
	access.newQueixinha(queixa, new function(err, queixa) {
			return res.redirect('/' + queixa.id);
		});
	
});

router.get('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa){
		if(queixa.autor.username !== req.user.username)	return res.redirect('/' + req.params.id);
		if(err) return next(err);
		db.getUser(req.user.username, function(err, user){
			if(err) return next(err);
			res.writeHead(200, {'Content-Type':'text/html' });
			return res.render('/edit', {queixinha:queixa, user:user});
		});
	});
});

router.post('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa) {
		db.getUser(req.user.username, function(err, user) {
			if(!user.gestor && queixa.autor.username !== req.user.username) return res.redirect('/' + req.params.id);
			var queixaEdit = new db.queixinha(null, req.body.title, req.body.desc, req.user, null, null, req.body.geo, null, req.body.categorias, req.body.closed);
			if(queixaEdit.titulo = "") {
				res.flash('Título não pode ser vazio');
				return res.render('/' + req.params.id + '/new', queixa);
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
		if(err){
			console.log(err);
			return next(err);
		}
		db.getQueixinha(req.params.id, function(err, queixa){
		if(err){
			console.log(err);
			return next(err);
		}	
		res.writeHead(200, {'Content-Type':'text/html' });
		return res.render('queixinha', { user: user, queixa: queixa, voted: user.voted});
		});
	});
});

module.exports = router;

