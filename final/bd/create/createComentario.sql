-- Table: "Comentario"

-- DROP TABLE "Comentario";

CREATE TABLE "Comentario"
(
  "Id" serial NOT NULL,
  "Id_Queixinha" serial NOT NULL,
  comentario character(140) NOT NULL,
  username character(50) NOT NULL,
  CONSTRAINT "pkComentario" PRIMARY KEY ("Id", "Id_Queixinha"),
  CONSTRAINT "user" FOREIGN KEY (username)
      REFERENCES utilizador (username) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Comentario"
  OWNER TO postgres;
