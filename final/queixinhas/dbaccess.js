var db = require('./dbUtility');
var conString = "postgres://:pedro@localhost/queixinhaBD";


var access = {};

access.queixinha = function queixinha(id, titulo, descricao, autor, Votos_Corretos,Votos_Incorretos,Georef, fechada, comnt, categoria)
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
	this.fechada = fechada;
}

access.user = function utilizador(username, hash, salt, email,gestor)
{
	this.username = username;
	this.hash = hash;
	this.salt = salt;
	this.email = email;
	this.gestor = gestor;
}

access.comment = function comentario(id, idqueixinha, comentario, username)
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
	db.dbselectAll("SELECT id, titulo, descricao, Votos_Corretos, Votos_Incorretos, username, Geo_referencia, Fechada from Queixinha LIMIT 10 OFFSET "+offset, 
		function (err, row) {
			if (err)
				cb(err, null);
			cb (null, new queixinha(row.id, row.titulo, row.descricao, row.username, row.Votos_Corretos, row.Votos_Incorretos, row.Geo_referencia, row.Fechada));
		});
};


access.getQueixinha = function (id, cb) {
	//return queixinha com id correspondente
	var coments = [];
	getComentQueixinha(id, function (err, com){
		coments[com.id] = com; 
	});
	var categoria = [];
	var index =0;
	getCategoriaQueixinha(id, function (err, c){
		categoria[index++] = c;
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
	db.dbSelectSome("SELECT id, Id_Queixinha, comentario, username from Comentario where Id_Queixinha = $1", 
		[id],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, new comentario(row.id, row.Id_Queixinha, row.comentario, row.username));
		});	
};

access.getCategoriaQueixinha = function(id, cb){
	db.dbSelectSome("SELECT categoria, Queixinha from Comentario where Queixinha = $1", 
		[id],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, row.Queixinha)
		});
};

access.getCategoria = function(designacao, cb){
	db.dbSelectOne("SELECT ID from Categoria where designacao = $1", 
		[designacao],
		function (err, row) {
			if (err)
				cb(err, null);
			cb(null, row.ID);
		});
};

//funcoes pa criar objects na BD. Chamar callback com o objecto criado
//recebe objecto incompleto (sem campos gerados, sem comentarios, sem ID)
//autor vem como objecto user
//categorias vem como string
access.newQueixinha = function(queixinha, cb){
	var params = [queixinha.titulo, queixinha.descricao, queixinha.username, queixinha.Georef];

    db.executeQuery("INSERT into queixinha(titulo, descricao, username, Geo_referencia) values($1, $2, $3, $4, $5) returning ID",
        params,
        function(err, id) { 
        	if (err)
        		cb(err, null);
//falta retornar id 
        	if (queixinha.categoria !== undefined){
    			var idc;
    			for (var i = queixinha.categoria.length - 1; i >= 0; i--) {
    				getCategoria(queixinha.categoria[i], 
    										function (c){ 
    											if (c !== undefined)
    												newCategoriaQueixinha(c, id, 
    															function(err) { 
        															if (err)
        																cb(err, null)
																	cb(null, queixinha.categoria[i]);
																});
    				else{
    					newCategoria(queixinha.categoria[i], function(err, id) { 
        														if (err)
        															cb(err, null)
																cb(null, id);
															});
    					newCategoriaQueixinha(c, id, function(err) { 
        												if (err)
        													cb(err, null)
														cb(null, c);	
													});
    				}
    			}); 
        	}
        }
        cb(null, id);});    
};

//CALLBACK a REVER
access.newUser = function(user, cb){
	var params = [user.username, username.hash, username.salt, username.email, username.gestor];
    db.executeQuery("INSERT into utilizador(username, hash, salt, email, Gestor) values($1, $2, $3, $4, $5)",
        params,
        function(err) { 
        	if (err)
        		cb(err, null)

        	cb(err, user.utilizador);
        });
};

access.newCategoria = function(designacao, cb){
	var params = [designacao];
    db.executeQuery("INSERT into Categoria(designacao) values($1) returning ID",
        params,
        function(err, id) { 
        	if (err)
        		cb(err, null);
        	cb(null, id); 
        }
    );
};

access.newCategoriaQueixinha = function(categoria, id, cb){
	var params = [categoria, id];
    db.executeQuery("INSERT into CategoriaQueixinha(categoria, queixinha) values($1, $2)",
        params,
        function(err) { 
        	if (err)
        		cb(err, null);
        	cb(null, id);
        }
    );
};
module.exports = access;