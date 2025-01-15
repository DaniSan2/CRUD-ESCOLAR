drop database if exists Escuela;
create database Escuela default character set utf8mb4;
use Escuela;
CREATE TABLE alumnos (
    idAlumno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    semestre INT NOT NULL,
    boleta VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT check_semestre CHECK (semestre > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO alumnos (nombre, carrera, semestre, boleta) VALUES
('Juan Pérez', 'Ingeniería en Sistemas', 3, '2025001'),
('Ana López', 'Arquitectura', 2, '2025002'),
('Carlos Ramírez', 'Ingeniería Civil', 5, '2025003'),
('María González', 'Diseño Gráfico', 1, '2025004'),
('Luis Martínez', 'Administración de Empresas', 6, '2025005'),
('Laura Sánchez', 'Ingeniería Química', 4, '2025006'),
('Pedro Hernández', 'Medicina', 7, '2025007'),
('Sofía Torres', 'Psicología', 2, '2025008'),
('Diego Morales', 'Derecho', 8, '2025009'),
('Gabriela Flores', 'Ingeniería Mecánica', 3, '2025010');

select *from alumnos;
