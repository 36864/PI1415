var db = require('./dbUtility');
var conString = "postgres://:pedro@localhost/queixinhaBD";


var access = {};

access.queixinha = function queixinha(id, titulo, descricao, autor, Votos_Corretos,Votos_Incorretos,Georef, fechada, comnt, categorias)
{
	this.id = id;
	this.titulo = titulo;
	this.descricao = descricao;
	this.autor = autor;
	this.Votos_Corretos = Votos_Corretos;
	this.Votos_Incorretos = Votos_Incorretos;
	this.Georef = Georef;
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

function categoria(id, designacao)
{
	this.id = id;
	this.designacao = designacao;
}

access.getQueixinhas = function (page, cb){
	//return lista de queixinhas, pagina page
	var offset = (page-1) * 10;
	db.SelectAll("SELECT id, titulo, descricao, Votos_Corretos, Votos_incorretos, username, Geo_referencia, Fechada from Queixinha LIMIT 10 OFFSET "+offset, 
		function (row) {
			return new queixinha(row.id, row.titulo, row.descricao, row.username, row.Votos_Corretos, row.Votos_incorretos,row.Geo_referencia, row.Fechada);
		}, cb);
};


access.getQueixinha = function (id, cb) {
	//return queixinha com id correspondente
	var coments = [];
	access.getComentQueixinha(id, function (err, el){
		if (err)
			return cb(err, null);

		coments[el.id] = com; 

		var categoria = [];
		var index =0;
		access.getCategoriaQueixinha(id, function (err, el){
			if (err)
				return cb(err, null);
			categoria[index++] = el;
	
		db.SelectOne("SELECT id, titulo, descricao, Votos_Corretos, Votos_Incorretos, username, Geo_referencia, Fechada from Queixinha where id = $1", 
					[id],
					function (row) {	
						return new queixinha(row.id, row.titulo, row.descricao, row.username, row.Votos_Corretos, row.Votos_Incorretos, row.Geo_referencia,row.Fechada,coments, categoria);
					}, cb);
		});
	});
};

access.getUser = function (name, cb){
	//return user
	db.SelectOne("SELECT username, hash, salt, email, gestor from utilizador where username = $1",
		[name], 
		function (row) {
			return new utilizador(row.username, row.hash, row.salt, row.email, row.gestor );
		}, cb);	
};

access.getComentQueixinha = function (id, cb){
	//return user
	db.SelectSome("SELECT id, Id_Queixinha, comentario, username from Comentario where Id_Queixinha = $1", 
		[id],
		function (row) {
			return new comentario(row.id, row.Id_Queixinha, row.comentario, row.username);
		}, cb);	
};

//faltas categorias
access.getQueixinhasUtilizador =function (username, cb){
	var index=0;
	db.SelectSome("SELECT ID, titulo, descricao,username, Votos_incorretos,Votos_Corretos, Geo_referencia, Fechada from Queixinha where username = $1", 
		[username],
		function (row) {
			var categorias =[];
			access.getCategoriaQueixinha(row.ID, function(r){
													 categorias[index++] = c;
			var queix = new queixinha(row.ID, row.titulo, row.descricao, row.username, row.Votos_Corretos,row.Votos_incorretos,row.Geo_referencia, row.fechada);
			queix.categorias = categorias;
			return queix;
		}, cb);
		},cb);
}

access.getQueixinhasbyIntUser = function (username, cb){
	var index = 0;
	db.SelectSome("SELECT ID, titulo, descricao,username, Votos_incorretos,Votos_Corretos, Geo_referencia, Fechada from Queixinha inner join CategoriaQueixinha on (ID = queixinha) where username = $1", 
		[username],
		function (row) {
			var categorias =[];
			access.getCategoriaQueixinha(row.ID, function(r){
										 categorias[index++] = c;
			var queix=new queixinha(row.ID, row.titulo, row.descricao, row.username, row.Votos_Corretos,row.Votos_incorretos,row.Geo_referencia, row.fechada);
			queix.categorias = categorias;
			return queix;
		}, cb);	
	}, cb);
}

access.getCategoriaQueixinha = function(id, cb){
	db.SelectSome("SELECT designacao from CategoriaQueixinha inner join Categoria on (ID = categoria) where Queixinha = $1", 
		[id],
		function (row) {
			return row.designacao;
		}, cb);
};

access.getCategoria = function(designacao, cb){
	db.SelectOne("SELECT ID from Categoria where designacao = $1", 
		[designacao],
		function (row) {
			return row.ID;
		}, cb);
};

//funcoes pa criar objects na BD. Chamar callback com o objecto criado
//recebe objecto incompleto (sem campos gerados, sem comentarios, sem ID)
//autor vem como objecto user
//categorias vem como string
access.newQueixinha = function(queixinha, cb){
	var params = [queixinha.titulo, queixinha.descricao, queixinha.username, queixinha.Georef];

    db.ExecuteQuery("INSERT into queixinha(titulo, descricao, username, Geo_referencia) values($1, $2, $3, $4, $5) returning ID",
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
    							newCategoriaQueixinha(c, id, 
    									function(err) { 
        									if (err)
        										return cb(err, null)
											cb(null, queixinha.categoria[i]);
										});
    				else{
    					access.newCategoria(queixinha.categoria[i], 
    								function(err, id) { 
        								if (err)
        									return cb(err, null)
        								
        								access.newCategoriaQueixinha(c, id, 
        												function(err) { 
        													if (err)
        														return cb(err, null);
															cb(null, null);	
														});
										cb(null, id);});
    				}
    			}); 
        	}
        }
        cb(null, id);
    });    
};


access.newUser = function(user, cb){
	var params = [user.username, user.hash, user.salt, user.email, user.gestor];
	console.log(user)
    db.ExecuteQuery("INSERT into utilizador(username, hash, salt, email, gestor) values($1, $2, $3, $4, $5)",
        params,
        function(err) { 
        	if (err)
        		cb(err, null)

        	cb(err, user.utilizador);
        });
};

access.newCategoria = function(designacao, cb){
	var params = [designacao];
    db.ExecuteQuery("INSERT into Categoria(designacao) values($1) returning ID",
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
    db.ExecuteQuery("INSERT into CategoriaQueixinha(categoria, queixinha) values($1, $2)",
        params,
        function(err) { 
        	if (err)
        		cb(err, null);
        	cb(null, id);
        }
    );
};

module.exports = access;