SELECT  designacao
  FROM categoria;
SELECT *
  FROM categoriaqueixinha;
 SELECT *
  FROM comentario;
  SELECT *
  FROM queixinha ;
    SELECT *
  FROM queixinhautilizador  ;
    SELECT *
  FROM utilizador  ;
    SELECT *
  FROM votacao  ;

delete from utilizador
where username = 'Miguel2'
INSERT INTO categoria( designacao)
    VALUES ( 'PI');
INSERT INTO categoria( designacao)
    VALUES ( 'Futebol');
INSERT INTO categoria( designacao)
    VALUES ( 'SI2');
INSERT INTO categoria( designacao)
    VALUES ( 'Basquetebol');

    delete from queixinha
	
	
CREATE FUNCTION udpatenotificacao() RETURNS trigger AS $udpatenotificacao$
    BEGIN
		update queixinhautuilizador set notificacao = true, datanotificacao = now()
		where queixinha = NEW.id_queixinha
        --RETURN NEW;
    END;
$udpatenotificacao$ LANGUAGE plpgsql;

CREATE TRIGGER udpatenotificacao AFTER INSERT OR UPDATE ON comentario
    FOR EACH ROW EXECUTE PROCEDURE udpatenotificacao();