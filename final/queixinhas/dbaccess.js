var db = require('./dbUtility');
var conString = "postgres://:pedro@localhost/queixinhaBD";

function queixinha(id, titulo, descricao, autor, Votos_Corretos,Votos_Incorretos,Georef, comnt, categoria)
{
	this.id = id;
	this.titulo = titulo;
	this.descricao = descricao;
	this.autor = autor;
	this.Votos_Corretos = Votos_Corretos;
	this.Votos_Incorretos = Votos_Incorretos;
	this.Georef = Georef;
	this.comnt = comnt;
	this.categoria = categoria;
}

function utilizador(username, hash, salt, email,gestor)
{
	this.username = username;
	this.hash = hash;
	this.salt = salt;
	this.email = email;
	this.gestor = gestor;
}

function comentario(id, idqueixinha, comentario, username)
{
	this.id = id;
	this.idqueixinha = idqueixinha;
	this.comentario = comentario;
	this.username = username;
}

function categoria(id, designacao)
{
	this.id = id;
	this.designacao = designacao;
}

access.getQueixinhas = function (page, cb){
	//return lista de queixinhas, pagina page
	var offset = (page-1) * 10;
	db.dbselectAll("SELECT id, titulo, descricao, Votos_Corretos, Votos_Incorretos, username, Geo_referencia from Queixinha LIMIT 10 OFFSET "+offset, 
		function (err, row) {
			if (err)
				cb(err, null);
			cb (null, new queixinha(row.id, row.titulo, row.descricao, row.username, row.Votos_Corretos, row.Votos_Incorretos, row.Geo_referencia));
		});
};


access.getQueixinha = function (id, cb) {
	//return queixinha com id correspondente
	var coments = [];
	getComentQueixinha(id, function (com){
		coments[com.id] = com; 
	});
	var categoria = [];
	getCategoriaQueixinha(id, function (c){
		categoria[] = c;
	})
	db.dbSelectOne("SELECT id, titulo, descricao, Votos_Corretos, Votos_Incorretos, username, Geo_referencia from Queixinha where id = $1", 
		[id],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, new queixinha(row.id, row.titulo, row.descricao, row.username, row.Votos_Corretos, row.Votos_Incorretos, row.Geo_referencia, coments))
		});
};

access.getUser = function (name, cb){
	//return user
	db.dbSelectOne("SELECT username, hash, salt, email, gestor from utilizador where username = $1",
		[name], 
		function (err, row) {
			if (err)
				cb(err, null);

			cb(null, new utilizador(row.username, row.hash, row.salt, row.email, row.gestor ));
		});	
};

access.getComentQueixinha = function (id, cb){
	//return user
	db.dbSelectOne("SELECT id, Id_Queixinha, comentario, username from Comentario where Id_Queixinha = $1", 
		[id],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, new comentario(row.id, row.Id_Queixinha, row.comentario, row.username)})
		});	
};

access.getCategoriaQueixinha = function(id, cb){
	db.dbSelectOne("SELECT categoria, Queixinha from Comentario where Queixinha = $1", 
		[id],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, row.Queixinha)
		});
}

module.exports = access;