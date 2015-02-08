var db = require('./dbaccess')

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
cnuser("Pedro","ped", "a36832@alunos.isel.pt", true);
cnuser("Miguel","mig", "a36864@alunos.isel.pt", true);
cnuser("Luz","luz", "a36919@alunos.isel.pt", true);
console.log('Criados');

var q = new access.queixinha();
q.titulo = "Trab PI";
q.username = "Pedro";
q.fechada = false;
var idqP;
access.newQueixinha(q, function(err, id){
						idqP = id;
						console.log(err);
});

var comment = access.comment();
comment.idqueixinha = idqP
comment.comentario = "Not Finished"; 
comment.username = "Miguel";

q.titulo = "Servidor";
q.username = "Miguel";
q.fechada = false;
access.newQueixinha(q, function(err, id){
						console.log(err);
});

q.titulo = "BOOTSTRAP ?!! N WORK";
q.username = "Luz";
q.fechada = false;
access.newQueixinha(q, function(err){
						console.log(err);
});

access.comment (id, idqueixinha, comentario, username);

access.newUser(user, cb);

access.newQueixinha(queixinha, cb);




access.newCategoria(designacao, cb);

access.newCategoriaQueixinha(categoria, id, cb);