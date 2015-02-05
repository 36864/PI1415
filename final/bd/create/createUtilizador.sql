-- Table: utilizador

-- DROP TABLE utilizador;

CREATE TABLE utilizador
(
  username character(20) NOT NULL,
  password character(20) NOT NULL,
  email character(20) NOT NULL,
  "Gestor" character(3) NOT NULL,
  CONSTRAINT utilizador_pkey PRIMARY KEY (username),
  CONSTRAINT "cGestor" CHECK ("Gestor" = ANY (ARRAY['Sim'::bpchar, 'Não'::bpchar]))
)
WITH (
  OIDS=FALSE
);
ALTER TABLE utilizador
  OWNER TO postgres;
