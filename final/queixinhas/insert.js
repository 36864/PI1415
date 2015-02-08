var db = require('./dbaccess');
var pass = require('pwd');

function cnuser (req, res, email, g) {
		var user = new db.user();
		user.username = req;
		user.email = email;
		user.gestor = g;
		console.log('username, email, gestor');
		if(req.user) return res.redirect('/');
		if(req === '' || res === '' || email === '') {
			res.flash('Please fill out all fields');
			return res.render('/register');
		}
		pass.hash(res, function(err, salt, hash)  {
			//var user = new db.user()
			user.salt = salt;
			user.hash = hash;
		
		console.log('JA TEM HASHSALT')
		db.newUser(user, function(err, user) {
			if(err) 
				console.log(err);
				//next('router');
			//return res.redirect('/');
			console.log ('Sucesso');
		});
		});
		console.log('CRIOU')
};
console.log('AcriaR')
cnuser("Pedro2","ped", "a36832@alunos.isel.pt", true);
cnuser("Miguel2","mig", "a36864@alunos.isel.pt", true);
cnuser("Luz2","Luz2", "a36919@alunos.isel.pt", true);
console.log('Criados');

console.log('Trab PIIIIIIIIIIIIIIIII');
var q = new db.queixinha();
q.titulo = "Trab PI";
q.username = "Pedro2";
q.fechada = false;
var idqueix;
db.newQueixinha(q, function(err, id){
						idqueix = id;
						console.log(err);
});

console.log(idqueix);
var comment = db.comment(0, idqueix,  "Not Finished", "Miguel2");

/*comment.idqueixinha = idqP
comment.comentario = "Not Finished"; 
comment.username = "Miguel2";*/
db.newComment(comment, function(err){
						console.log(err);
});

comment = db.comment(0, idqueix, "FDS","Luz2");
/*comment.idqueixinha = idqueix;
comment.comentario = "FDS"; 
comment.username = "Luz2";*/
db.newComment(comment, function(err){
						console.log(err);
});


var idcategoria;
db.newCategoria("PI", function(err, id){
							idcategoria = id;
						console.log(err);
});
db.newCategoriaQueixinha(idcategoria, idqueix, function(err){
													console.log(err)
												});
console.log('Servidor');
q.titulo = "Servidor";
q.username = "Miguel2";
q.fechada = false;
db.newQueixinha(q, function(err, id){
	idqueix = id;
						console.log(err);
});

comment = db.comment(0, idqueix, "FDS", "Luz2");
db.newComment(comment, function(err){
						console.log(err);
});

db.newCategoriaQueixinha(idcategoria, idqueix, function(err){
													console.log(err)
												});

console.log('BOOTSTRAP');
q.titulo = "BOOTSTRAP ?!! N WORK";
q.username = "Luz2";
q.fechada = false;
db.newQueixinha(q, function(err, id){
							idqueix = id;
						console.log(err);
});

comment = db.comment(0, idqueix,"FDS", "Miguel2");
db.newComment(comment, function(err){
						console.log(err);
});

db.newCategoriaQueixinha(idcategoria, idqueix, function(err){
													console.log(err)
												});