-- Table: "Categoria"

-- DROP TABLE "Categoria";

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
