var db = require('./dbUtility');

var access = {};

access.queixinha = function queixinha(id, titulo, descricao, autor, Votos_Corretos,Votos_Incorretos,Georef, fechada, comnt, categorias)
{
	this.id = id;
	this.titulo = titulo;
	this.descricao = descricao;
	this.autor = autor;
	this.votos_corretos = Votos_Corretos;
	this.votos_incorretos = Votos_Incorretos;
	this.georef = Georef;
	this.comnt = comnt;
	this.categorias = categorias;
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

access.categoria = function categoria(id, designacao)
{
	this.id = id;
	this.designacao = designacao;
}

access.getQueixinhas = function (page, cb){
	//return lista de queixinhas, pagina page
	var offset = (page-1) * 10;
	db.SelectAll("SELECT id, titulo, descricao, votos_corretos, votos_incorretos, username, geo_referencia, fechada from queixinha LIMIT 10 OFFSET "+offset, 
		function (row) {
			return new access.queixinha(row.id, row.titulo, row.descricao, row.username, row.votos_corretos, row.votos_incorretos,row.geo_referencia, row.fechada);
		}, cb);
};


access.getQueixinha = function (id, cb) {
	var coments = [];
	access.getComentQueixinha(id, function (err, el){
		if (!err)
			coments = el; 
		var categoria = [];
		access.getCategoriaQueixinha(id, function (err, el){
			if (!err)
				categoria = el;
	
		db.SelectOne("SELECT id, titulo, descricao, votos_corretos, votos_incorretos, username, geo_referencia, fechada from queixinha where id = $1", 
					[id],
					function (row) {	
						return new access.queixinha(row.id, row.titulo, row.descricao, row.username, row.votos_corretos, row.votos_incorretos, row.geo_referencia,row.fechada,coments, categoria);
					}, cb);
		});
	});
};

access.getUser = function (name, cb){
	//return user
	db.SelectOne("SELECT username, hash, salt, email, gestor from utilizador where username = $1",
		[name], 
		function (row) {
			return new access.user(row.username, row.hash, row.salt, row.email, row.gestor );
		}, cb);	
};

access.getComentQueixinha = function (id, cb){
	//return user
	db.SelectSome("SELECT id, id_queixinha, comentario, username from comentario where id_queixinha = $1", 
		[id],
		function (row) {
			return new access.comment(row.id, row.id_queixinha, row.comentario, row.username);
		}, cb);	
};

access.getQueixinhasUtilizador =function (username, cb){
	db.SelectSome("SELECT id, titulo, descricao,username, votos_incorretos,votos_corretos, geo_referencia, fechada from queixinha where username = $1", 
		[username],
		function (row) {
			//var categorias =[];
			var queix = new access.queixinha(row.id, row.titulo, row.descricao, row.username, row.votos_corretos,row.votos_incorretos,row.geo_referencia, row.fechada);
			access.getCategoriaQueixinha(row.id,function(err, catgs){
					if(!err){
						//categorias = c;					
						queix.categorias = catgs;
					}
				}, cb);
			return queix;
		}, cb);
}

access.getQueixinhasbyIntUser = function (username, cb){
	//var index = 0;
	db.SelectSome("SELECT id, titulo, descricao,username, votos_incorretos,votos_corretos, geo_referencia, fechada from queixinha inner join categoriaqueixinha on (id = queixinha) where username = $1", 
		[username],
		function (row) {
			//var categorias =[];
			var queix = new access.queixinha(row.id, row.titulo, row.descricao, row.username, row.votos_corretos,row.votos_incorretos,row.geo_referencia, row.fechada);
			access.getCategoriaQueixinha(row.id, function(err, catgs){
					// categorias[index++] = c;
					if(!err){
						//categorias = c;					
						queix.categorias = catgs;
					}}, cb);
					//queix.categorias = categorias;
			return queix;
		}, cb);
}

access.getCategoriaQueixinha = function(id, cb){
	db.SelectSome("SELECT designacao from categoriaqueixinha inner join categoria on (id = categoria) where queixinha = $1", 
		[id],
		function (row) {
			return row.designacao;
		}, cb);
};

access.getCategoria = function(designacao, cb){
	db.SelectOne("SELECT id from categoria where designacao = $1", 
		[designacao],
		function (row) {
			return row.id;
		}, cb);
};

//funcoes pa criar objects na BD. Chamar callback com o objecto criado
//recebe objecto incompleto (sem campos gerados, sem comentarios, sem ID)
//autor vem como objecto user
//categorias vem como string
access.newQueixinha = function(queixinha, cb){
	var params;
	if ( !queixinha.fechada)
		var params = [queixinha.titulo, queixinha.descricao, queixinha.autor, queixinha.Georef, false];
	else
		var params = [queixinha.titulo, queixinha.descricao, queixinha.autor, queixinha.Georef, queixinha.fechada];

    db.ExecuteQuery("INSERT into queixinha(titulo, descricao, username, geo_referencia, fechada) values($1, $2, $3, $4, $5) returning id",
        params,
        function(err, id) { 
        	if (err)
        		return cb(err, null);

        	if (queixinha.categoria !== undefined){
    			for (var i = queixinha.categoria.length - 1; i >= 0; i--) {
    				access.getCategoria(queixinha.categoria[i], 
    					function (err, c){ 
    						if (err)
        				 		return cb(err, null);
    						if (c !== undefined)
    							newCategoriaQueixinha(c, id, function(err) { 
        									if (err)
        										return cb(err, null)
										});
    						else{
    							access.newCategoria(queixinha.categoria[i], function(err, id) { 
        								if (err)
        									return cb(err, null)
        								
        								access.newCategoriaQueixinha(c, id, function(err) { 
        										if (err)
        											return cb(err, null);
										});
								});
    						}
    					}); 
        		}	
        	}
        	queixinha.id = id;
        	return cb(null, queixinha);
    });    
};


access.newUser = function(user, cb){
	var params = [user.username, user.hash, user.salt, user.email, user.gestor];
    db.ExecuteQuery("INSERT into utilizador(username, hash, salt, email, gestor) values($1, $2, $3, $4, $5)",
        params,
        function(err) { 
        	if (err)
        		return cb(err, null)

        	cb(null, user);
        });
};

access.newCategoria = function(designacao, cb){
	var params = [designacao];
    db.ExecuteQuery("INSERT into categoria(designacao) values($1) returning id",
        params,
        function(err, id) { 
        	if (err)
        		cb(err, null);
        	cb(null, new access.categoria(id, designacao)); 
        }
    );
};

access.newCategoriaQueixinha = function(categoria, id, cb){
	var params = [categoria, id];
    db.ExecuteQuery("INSERT into categoriaqueixinha(categoria, queixinha) values($1, $2)",
        params,
        function(err) { 
        	if (err)
        		cb(err, null);
        	cb(null, id);
        }
    );
};

access.newComment = function(coment, cb){
	var params = [coment.idqueixinha, coment.comentario, coment.username];
	db.ExecuteQuery("INSERT into comentario(id_queixinha, comentario, username) values($1, $2, $3)",
        params,
        function(err) { 
        	if (err)
        		return cb(err, null)

        	cb(null, coment);
        });
};

module.exports = access;