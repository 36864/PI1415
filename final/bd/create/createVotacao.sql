-- Table: votacao

-- DROP TABLE votacao;

CREATE TABLE votacao
(
  id_queixinha serial NOT NULL,
  username character(50) NOT NULL,
  correta boolean NOT NULL,
  CONSTRAINT pkvotacao PRIMARY KEY (id_queixinha, username),
  CONSTRAINT "fkUser" FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE votacao
  OWNER TO postgres;
