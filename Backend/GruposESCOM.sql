use Escuela;
CREATE TABLE grupos (
    idGrupo INT AUTO_INCREMENT PRIMARY KEY,
    nombreGrupo VARCHAR(50) NOT NULL,
    idCarrera INT NOT NULL,
    semestre INT NOT NULL,
    FOREIGN KEY (idCarrera) REFERENCES carreras(idCarrera)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO grupos (nombreGrupo, idCarrera, semestre) VALUES
('Grupo A', 1, 1), 
('Grupo B', 1, 1),  
('Grupo A', 2, 2), 
('Grupo B', 2, 2),  
('Grupo A', 3, 3), 
('Grupo B', 3, 3), 
('Grupo A', 4, 1), 
('Grupo B', 4, 1),  
('Grupo A', 5, 2), 
('Grupo B', 5, 2);  

select*from grupos;
