-- Table: "Queixinha"

-- DROP TABLE "Queixinha";

CREATE TABLE "Queixinha"
(
  titulo character(140) NOT NULL,
  descricao character(140),
  username character(20),
  "Votos_Corretos" integer,
  "Votos_incorretos" integer,
  "ID" serial NOT NULL,
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
