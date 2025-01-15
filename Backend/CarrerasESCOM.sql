use Escuela;
CREATE TABLE carreras (
    idCarrera INT AUTO_INCREMENT PRIMARY KEY,
    carrera VARCHAR(100) NOT NULL,
    descripcionCarrera TEXT,
    semestres INT NOT NULL,
    plan INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO carreras (carrera, descripcionCarrera, semestres, plan) VALUES
('Ingeniería en Sistemas', 'Carrera enfocada en el diseño, implementación y gestión de sistemas computacionales.', 8, 2023),
('Arquitectura', 'Carrera orientada al diseño y construcción de espacios funcionales y estéticos.', 10, 2022),
('Ingeniería Civil', 'Formación en diseño, construcción y mantenimiento de infraestructura civil.', 9, 2021),
('Diseño Gráfico', 'Carrera enfocada en la comunicación visual y diseño digital.', 8, 2023),
('Administración de Empresas', 'Estudio de técnicas y estrategias para gestionar organizaciones exitosamente.', 8, 2023),
('Ingeniería Química', 'Carrera que aborda procesos químicos y su aplicación industrial.', 9, 2022),
('Medicina', 'Estudio y práctica de la salud y el cuidado médico.', 12, 2020),
('Psicología', 'Carrera dedicada al estudio del comportamiento humano y sus procesos mentales.', 8, 2023),
('Derecho', 'Formación en leyes, normativas y práctica jurídica.', 10, 2021),
('Ingeniería Mecánica', 'Carrera orientada al diseño y manufactura de sistemas mecánicos.', 8, 2023);

select *from carreras;