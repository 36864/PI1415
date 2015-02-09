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
	
CREATE FUNCTION contagemvotos() RETURNS trigger AS $contagemvotos$
    BEGIN
		if (NEW.correta)
		begin
			update queixinha set votos_corretos += 1
			where id = NEW.id_queixinha
		end
		else
		begin
			update queixinha set votos_incorretos += 1
			where id = NEW.id_queixinha
		end
        --RETURN NEW;
    END;
$contagemvotos$ LANGUAGE plpgsql;

CREATE TRIGGER contagemvotos AFTER INSERT OR UPDATE ON votacao
    FOR EACH ROW EXECUTE PROCEDURE contagemvotos();
	
	
	
	
CREATE FUNCTION contvotosupnotif() RETURNS trigger AS $contvotosupnotif$
    BEGIN
		update queixinhautuilizador set notificacao = true, datanotificacao = now()
		where queixinha = NEW.id_queixinha and username in (select username from queixinha where id = NEW.id_queixinha) 
		if (NEW.correta)
		begin
			update queixinha set votos_corretos += 1
			where id = NEW.id_queixinha
		end
		else
		begin
			update queixinha set votos_incorretos += 1
			where id = NEW.id_queixinha
		end
        RETURN Null;
    END;
$contvotosupnotif$ LANGUAGE plpgsql;

CREATE TRIGGER contvotosupnotif AFTER INSERT OR UPDATE OR DElete ON votacao
    FOR EACH ROW EXECUTE PROCEDURE contvotosupnotif();