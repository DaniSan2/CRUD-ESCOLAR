use Escuela;
CREATE TABLE materias (
    idMateria INT AUTO_INCREMENT PRIMARY KEY,
    nombreMateria VARCHAR(100) NOT NULL,
    creditos INT NOT NULL,
    semestre INT NOT NULL,
    idCarrera INT NOT NULL,
    FOREIGN KEY (idCarrera) REFERENCES carreras(idCarrera)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO materias (nombreMateria, creditos, semestre, idCarrera)
VALUES 
('Matemáticas I', 6, 1, 1),  
('Física I', 6, 1, 2),       
('Cálculo Diferencial', 5, 1, 3), 
('Programación I', 6, 1, 1),  
('Álgebra Lineal', 5, 2, 3), 
('Química Orgánica', 6, 2, 2);  

select*from materias;
