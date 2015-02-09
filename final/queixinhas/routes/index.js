var express = require('express');
var router = express.Router();
var db = require('../dbaccess');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user);	
	//check user authentication
	//get list of top/most recent entries for unauthenticated users
	//else get list of entries, add paging
	console.log('no user');
	db.getQueixinhas(1, function(err, queixas){		
		if(err) {
			if(err.message !== 'RECORD NOT FOUND')
				return next(err);
		}
		console.log('got list');
		db.getUser(req.user.username, function(err, user){
			if(err) {
				if(err.message !== 'RECORD NOT FOUND')
					return next(err);
			}
			console.log('got user');
			db.getCountQueixinhas(function(err, count) {
				count = Math.ceil(count/10);
				console.log(count);
				if(count > 0 && req.user.username){
					db.getvotobyuser(user.username, function(err, votos){
						if(err) {
							if(err.message !== 'RECORD NOT FOUND')
								return next(err);
						}
						queixas.forEach(function(value){
							if(!votos) {
								value.voto = 0;								
							}
							else{
								var voto = votos.find(function(voto){
									return this.id===voto.queixinha;								
								}, value);
								console.log(voto);
								if(voto) value.voto = voto;
								else value.voto = 0;
							}
						});
						console.log(queixas);
						return res.render('index', {queixas: queixas, user:req.user});
					});
				}
				return res.render('index', {queixas: queixas, user:req.user});
			});
		});
	});
	
});

module.exports = router;
