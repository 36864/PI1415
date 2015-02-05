-- Table: votacao

-- DROP TABLE votacao;

CREATE TABLE votacao
(
  id_queixinha serial NOT NULL,
  username character(20) NOT NULL,
  correta character(3),
  CONSTRAINT pkvotacao PRIMARY KEY (id_queixinha, username),
  CONSTRAINT "fkUser" FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "cCorreta" CHECK (correta = ANY (ARRAY['Sim'::bpchar, 'Não'::bpchar]))
)
WITH (
  OIDS=FALSE
);
ALTER TABLE votacao
  OWNER TO postgres;
