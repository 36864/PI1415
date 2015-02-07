-- Table: utilizador

-- DROP TABLE utilizador;

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
