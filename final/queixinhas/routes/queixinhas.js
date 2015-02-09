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
	db.getQueixinhas(page, function(err, queixas){		
		if(err) {
			if(err.message !== 'RECORD NOT FOUND')
				return next(err);
		}
		db.getUser(req.user.username, function(err, user){
			if(err) {
				if(err.message !== 'RECORD NOT FOUND')
					return next(err);
			}
			db.getCountQueixinhas(function(err, count) {
				count = Math.ceil(count/10);
				if(count > 0 && user.username){
					db.getvotobyuser(user.username, function(err, votos){
						queixas.forEach(function(value){
							var voto = votos.find(function(voto){
										return this.id===voto.queixinha;								
										}, value);
							if(voto) queixas.voto = voto;
							else queixas.voto = 0;
						});
						return res.render('queixinhas', {queixas: queixas, user:req.user, page:page, total:count});
					});
				}
				return res.render('queixinhas', {queixas: queixas, user:req.user, page:page, total:count});
			});
		});
	});

});

router.get('/dashboard', function(req, res, next) {
	db.getQueixinhasUtilizador(req.user.username, function(err, queixasbyuser){
		if(err) {			
			if(err.message !== 'RECORD NOT FOUND')
			return next(err);
		}
		db.getQueixinhasbyIntUser(req.user.username, function(err, interest){
			if(err) { 
				if(err.message !== 'RECORD NOT FOUND')
				return next(err);
			}
			console.log(queixasbyuser)
			console.log(interest);
			return res.render('dashboard', {user: req.user, queixasUser : queixasbyuser, queixasInterested:interest});
		});	
	});
});


router.get('/new', function(req, res, next) {
	console.log('GOT TO NEW');
	return res.render('novaqueixinha', { user: req.user});
});

router.post('/new', function(req, res, next) {
	var queixa = {
		titulo: req.body.title, 
		descricao: req.body.desc,
		autor: req.user.username,
		georef: req.body.geo,
		categorias: req.body.categorias
		};
	if(queixa.titulo === '') {
		res.flash('Título não pode ser vazio');
		return res.render('novaqueixinha', {user: user, queixa: queixa});
	}
	console.log(queixa);
	db.newQueixinha(queixa, function(err, queixa) {
			if(err) return next(err);
			console.log(queixa);		
			return res.redirect('/queixinhas/' + queixa.id);
	});
});

router.get('/:id', function(req, res, next) {
	if(!req.user) req.user.username = '';
	db.getUser(req.user.username, function(err, user) {
		if(err && err.message !== 'RECORD NOT FOUND') return next(err);
		db.getQueixinha(req.params.id, function(err, queixa){
			if(err && err.message !== 'RECORD NOT FOUND') return res.redirect('/queixinhas');
			return res.render('queixinha', {queixinha: queixa, user: user});
		});
	});
});


router.get('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa){
		if(err) return next(err);	
		if(queixa.autor !== req.user.username)	return res.redirect('/' + req.params.id);
		if(err) return next(err);
		db.getUser(req.user.username, function(err, user){
			if(err) return next(err);
			return res.render('/edit', {queixinha:queixa, user:user});
		});
	});
});

router.post('/:id/edit', function(req, res, next) {
	db.getQueixinha(req.params.id, function(err, queixa) {
		db.getUser(req.user.username, function(err, user) {
			if(!user.gestor && queixa.autor !== req.user.username) return res.redirect('/' + req.params.id);
			var queixaEdit = new db.queixinha(null, req.body.title, req.body.desc, req.user, null, null, req.body.geo, null, req.body.categorias, req.body.closed);
			if(queixaEdit.titulo = "") {
				res.flash('Título não pode ser vazio');
				return res.render('/' + req.params.id + '/edit', {user: user, queixa: queixa});
			}
			queixa.titulo = queixaEdit.titulo;
			queixa.descricao = queixaEdit.descricao;
			queixa.categorias = queixaEdit.categorias;
			queixa.fechada = queixaEdit.fechada;
			db.editQueixinha(queixa, req.body.comment, user);
			return res.redirect('/' + queixa.id);
		});
	});
});

router.post('/:id:/downvote', function(req,res,next){
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
			db.newvoto(user.username, queixa.id, false, function(err){ 
				return res.render('queixinha', { user: user, queixa: queixa, voted: user.voted});
			});
		});
	});
});

router.post('/:id/upvote', function(req, res, next) {
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
			db.newvoto(user.username, queixa.id, true, function(err){ 
				return res.render('queixinha', { user: user, queixa: queixa, voted: user.voted});
			});
		});
	});
});

router.post('/:id/subscribe', function(req, res, next) {
	
});

router.post('/:id/unsubscribe', function(req, res, next) {
	
});

router.post('/:id/comment', function(req, res, next) {
	db.getUser(req.user.username, function(err, user) {
		if(err){
			return next(err);
		}
		if(req.body.comment === '') {
			return res.render('/:id/', {user: user, error:'Comentário não pode ser vazio'});
		}
		
	});
});

module.exports = router;

