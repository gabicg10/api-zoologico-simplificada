------------------------------------------------------------------------------------
------------- CRIANDO TABELAS
------------------------------------------------------------------------------------ 
CREATE TABLE IF NOT EXISTS Animal (idAnimal SERIAL NOT NULL PRIMARY KEY,
					nomeAnimal VARCHAR(50) NOT NULL,
					idadeAnimal INT,
					generoAnimal VARCHAR(15) NOT NULL,
                    envergadura FLOAT NOT NULL);
				 
CREATE TABLE IF NOT EXISTS Habitat (idHabitat SERIAL NOT NULL PRIMARY KEY,
					 nomeHabitat VARCHAR(50) NOT NULL);
					 
CREATE TABLE IF NOT EXISTS Atracao (idAtracao SERIAL NOT NULL PRIMARY KEY,
					 nomeAtracao VARCHAR(50) NOT NULL,
					 idHabitat INT,
					 FOREIGN KEY (idHabitat) REFERENCES Habitat(idHabitat));
					 
CREATE TABLE IF NOT EXISTS Animal_Habitat(idAnimalHabitat SERIAL NOT NULL PRIMARY KEY,
						   idAnimal INT,
						   idHabitat INT,
						   FOREIGN KEY (idAnimal) REFERENCES Animal(idAnimal),
						   FOREIGN KEY (idHabitat) REFERENCES Habitat(idHabitat));

------------------------------------------------------------------------------------
------------- POPULANDO TABELAS (INSERT)
------------------------------------------------------------------------------------
INSERT INTO Animal(nomeAnimal, idadeAnimal, generoAnimal, envergadura)
	VALUES
	('ZAZU', 1, 'MACHO', 0.55),			-- id 1
	('IAGO', 2, 'MACHO', 0.98),			-- id 2
	('SCUTTLE', 4, 'FEMEA', 0.35),		-- id 3
	('KAA', 1, 'MACHO', 0.59),			-- id 4
	('LOUIS', 5, 'MACHO', 0.90),			-- id 5
	('TICK-TOCK', 3, 'FEMEA', 1.10);		-- id 6
	
INSERT INTO Habitat(nomeHabitat)
	VALUES
	('PLANÍCIE'),	-- id 1
	('FLORESTA'),	-- id 2
	('PÂNTANO'),	-- id 3
	('MONTANHA'),	-- id 4
	('ILHA');		-- id 5
	
INSERT INTO Animal_Habitat(idAnimal, idHabitat)
	VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 2),
	(6, 2);
	
INSERT INTO Atracao(nomeAtracao, idHabitat)
	VALUES
	('PASSEIO DE JEEP', 1),		-- id 1
	('ALIMENTAR OS LEÕES', 1),	-- id 2
	('PENTEAR MACACO', 2),		-- id 3
	('CORRER DAS COBRAS', 3);	-- id 4