-- Table: utilizador

-- DROP TABLE utilizador;

CREATE TABLE utilizador
(
  username character(20) NOT NULL,
  password character(20) NOT NULL,
  email character(20) NOT NULL,
  "Gestor" boolean NOT NULL,
  CONSTRAINT utilizador_pkey PRIMARY KEY (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE utilizador
  OWNER TO postgres;
