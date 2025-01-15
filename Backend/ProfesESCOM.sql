use Escuela;
CREATE TABLE profesores (
    idProfesor INT AUTO_INCREMENT PRIMARY KEY,
    nombreProfesor VARCHAR(100) NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(15)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO profesores (nombreProfesor, titulo, especialidad, telefono)
VALUES 
('Juan Pérez', 'Licenciado', 'Matemáticas', '555-1234'),
('Ana García', 'Máster', 'Física', '555-5678'),
('Carlos López', 'Doctor', 'Química', '555-8765');

select*from profesores;