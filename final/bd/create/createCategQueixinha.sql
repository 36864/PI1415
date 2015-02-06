-- Table: "CategoriaQueixinha"

-- DROP TABLE "CategoriaQueixinha";

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
