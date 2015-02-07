CREATE TABLE utilizador
(
  username character(50) NOT NULL,
  email character(50) NOT NULL,
  "Gestor" boolean NOT NULL,
  hash character(128) NOT NULL,
  salt character(128) NOT NULL,
  CONSTRAINT utilizador_pkey PRIMARY KEY (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE utilizador
  OWNER TO postgres;
  

CREATE TABLE "Queixinha"
(
  titulo character(140) NOT NULL,
  descricao character(140),
  username character(20),
  "Votos_Corretos" integer,
  "Votos_incorretos" integer,
  "ID" serial NOT NULL,
  "Geo_referencia" character(20),
  "Fechada" boolean NOT NULL,
  CONSTRAINT "pkQueixinha" PRIMARY KEY ("ID"),
  CONSTRAINT username FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Queixinha"
  OWNER TO postgres;
  
CREATE TABLE "Comentario"
(
  "Id" serial NOT NULL,
  "Id_Queixinha" serial NOT NULL,
  comentario character(140) NOT NULL,
  username character(50) NOT NULL,
  CONSTRAINT "pkComentario" PRIMARY KEY ("Id", "Id_Queixinha"),
  CONSTRAINT "fkQueixinha" FOREIGN KEY ("Id_Queixinha")
      REFERENCES "Queixinha" ("ID") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "user" FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Comentario"
  OWNER TO postgres;
  

CREATE TABLE "Categoria"
(
  "ID" serial NOT NULL,
  designacao character(20) NOT NULL,
  CONSTRAINT "pkCategoria" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Categoria"
  OWNER TO postgres;

CREATE TABLE votacao
(
  id_queixinha serial NOT NULL,
  username character(50) NOT NULL,
  correta boolean NOT NULL,
  CONSTRAINT pkvotacao PRIMARY KEY (id_queixinha, username),
  CONSTRAINT "fkQueixinha" FOREIGN KEY (id_queixinha)
      REFERENCES "Queixinha" ("ID") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fkUser" FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE votacao
  OWNER TO postgres;

CREATE TABLE "CategoriaQueixinha"
(
  categoria serial NOT NULL,
  "Queixinha" serial NOT NULL,
  CONSTRAINT "pkCatQueixinha" PRIMARY KEY (categoria, "Queixinha"),
  CONSTRAINT "fkCategoria" FOREIGN KEY (categoria)
      REFERENCES "Categoria" ("ID") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fkQueixinha" FOREIGN KEY ("Queixinha")
      REFERENCES "Queixinha" ("ID") MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "CategoriaQueixinha"
  OWNER TO postgres;