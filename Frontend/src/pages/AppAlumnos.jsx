import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";
import axios from "axios";

// url de la api dani, yo uso el puerto 5000 pero si tienes broncas se puede cambiar
const API_URL = "http://127.0.0.1:5000/alumnos"; // asegurate que corra bien este es muy importante

const AppAlumnos = () => { // lista de carreras
  const [alumnos, setAlumnos] = useState([]); // lista de alumnos
  const [grupos, setGrupos] = useState([]); // lista de carreras
  const [error, setError] = useState(null); // para manejar errores
  const [showAlumnoForm, setShowAlumnoForm] = useState(false); // muestra u oculta el formulario
  const [selectedAlumno, setSelectedAlumno] = useState(null); // guarda la carrera seleccionada para editar
  
  const [newAlumno, setNewAlumno] = useState({
    nombre: "",
    carrera: "",
    semestre: "",
    boleta: "",
  });

  // trae los datos de los alumnos desde la api
  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlumnos(response.data);
    } catch (err) {
      setError("error al cargar los alumnos");
    }
  };

  const fetchCarreras = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/carreras"); // recuerda revisar que corran bien estos urls
      setCarreras(response.data);
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  // se ejecuta al cargar la pagina
  useEffect(() => {
    fetchAlumnos();
    
    fetchCarreras();
  }, []);

  // guarda o actualiza un alumno
  const handleSaveAlumno = async () => {
    try {
      if (selectedAlumno) {
        await axios.put(`${API_URL}/${selectedAlumno.idAlumno}`, newAlumno);
      } else {
        await axios.post(API_URL, newAlumno);
      }
      fetchAlumnos(); // refresca la lista de alumnos
      setShowAlumnoForm(false); // cierra el form
      setSelectedAlumno(null); // limpia la seleccion
      setNewAlumno({ nombre: "", carrera: "", semestre: "", boleta: "" });
    } catch (err) {
      setError("error al guardar el alumno");
    }
  };

  // elimina un alumno por su id
  const handleDeleteAlumno = async (idAlumno) => {
    try {
      await axios.delete(`${API_URL}/${idAlumno}`);
      fetchAlumnos(); // refresca la lista de alumnos
    } catch (err) {
      setError("error al eliminar el alumno");
    }
  };

  // carga los datos de un alumno en el formulario para editar
  const handleEditAlumno = (alumno) => {
    setSelectedAlumno(alumno); // selecciona la carrera para editar
    setNewAlumno({
      nombre: alumno.nombre,
      carrera: alumno.carrera,
      semestre: alumno.semestre,
      boleta: alumno.boleta,
    });
    setShowAlumnoForm(true);
  };
// esto es lo que se muestra en la pagina y es lo divertido :)
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen p-8">
      {/* Titulo principal */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            Gestion de Alumnos
          </span>
        </h1>
        <p className="text-sm text-gray-600 mt-2">Este es mi proyecto final de web</p>
      </header>

      {/* Tabla con alumnos */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Alumnos</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Semestre</th>
              <th className="p-4 text-left">Boleta</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* aqui se mapean los alumnos para mostrarlos en la tabla */}
            {alumnos.map((alumno) => (
              <tr key={alumno.idAlumno} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{alumno.nombre}</td>
                <td className="p-4">{alumno.carrera}</td>
                <td className="p-4">{alumno.semestre}</td>
                <td className="p-4">{alumno.boleta}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditAlumno(alumno)}
                    className="text-blue-500 hover:underline"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteAlumno(alumno.idAlumno)}
                    className="text-red-500 hover:underline"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Boton para agregar alumno */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAlumnoForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="inline-block mr-2" /> Nuevo Alumno
        </button>
      </div>

      {showAlumnoForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedAlumno ? "Editar Alumno" : "Nuevo Alumno"}</h3>
            <input
              type="text"
              placeholder="Nombre de la carrera"
              value={newAlumno.nombre}
              onChange={(e) => setNewAlumno({ ...newAlumno, nombre: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Descripción"
              value={newAlumno.carrera}
              onChange={(e) => setNewAlumno({ ...newAlumno, carrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="number"
              placeholder="Semestres"
              value={newAlumno.semestre}
              onChange={(e) => setNewAlumno({ ...newAlumno, semestre: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Plan"
              value={newAlumno.boleta}
              onChange={(e) => setNewAlumno({ ...newAlumno, boleta: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveAlumno} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowAlumnoForm(false);
                  setNewAlumno(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cambio de pagina */}
      <footer className="text-center mt-8">
        <Link to="/carreras" className="text-blue-500 hover:underline text-lg">
          Gestionar Carreras <ArrowRight />
        </Link>
      </footer>
      <footer className="text-center mt-8">
        <Link to="/grupos" className="text-blue-500 hover:underline text-lg">
          Gestionar Grupos <ArrowRight />
        </Link>
      </footer>

       <footer className="text-center mt-8">
              <Link to="/materias" className="text-blue-500 hover:underline text-lg">
                Gestionar Materias <ArrowRight />
              </Link>
       </footer>

        <footer className="text-center mt-8">
               <Link to="/profesores" className="text-blue-500 hover:underline text-lg">
                 Gestionar Profesores <ArrowRight />
               </Link>
        </footer>
    </div>
  );
};

export default AppAlumnos;
