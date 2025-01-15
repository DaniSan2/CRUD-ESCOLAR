import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";
import axios from "axios";

// url de la api dani, yo uso el puerto 5000 pero si tienes broncas se puede cambiar
const API_URL = "http://127.0.0.1:5000/profesores"; // asegurate que corra bien este es muy importante

const AppProfesores = () => { // lista de carreras
  const [alumnos, setAlumnos] = useState([]); // lista de alumnos
  const [grupos, setGrupos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);  // lista de carreras
  const [error, setError] = useState(null); // para manejar errores
  const [showProfesorForm, setShowProfesorForm] = useState(false); // muestra u oculta el formulario
  const [selectedProfesor, setSelectedProfesor] = useState(null); // guarda la carrera seleccionada para editar
  
  const [newProfesor, setNewProfesor] = useState({
    nombreProfesor: "",
    titulo: "",
    especialidad: "",
    telefono: "",
  });

  // trae los datos de los alumnos desde la api
  const fetchProfesor = async () => {
    try {
      const response = await axios.get(API_URL);
      setProfesores(response.data);
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

  const fetchGrupos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/grupos"); // recuerda revisar que corran bien estos urls
      setGrupos(response.data);
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/alumnos"); // recuerda revisar que corran bien estos urls
      setAlumnos(response.data);
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/materias"); // recuerda revisar que corran bien estos urls
      setMaterias(response.data);
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  // se ejecuta al cargar la pagina
  useEffect(() => {
    fetchAlumnos();
    fetchMaterias();
    fetchCarreras();
    fetchProfesor();
    fetchGrupos();
  }, []);

  // guarda o actualiza un alumno
  const handleSaveProfesor = async () => {
    try {
      if (selectedProfesor) {
        await axios.put(`${API_URL}/${selectedProfesor.idProfesor}`, newProfesor);
      } else {
        await axios.post(API_URL, newProfesor);
      }
      fetchProfesor(); // refresca la lista de alumnos
      setShowProfesorForm(false); // cierra el form
      setSelectedProfesor(null); // limpia la seleccion
      setNewProfesor({ nombreProfesor: "", titulo: "", especialidad: "", telefono: "" });
    } catch (err) {
      setError("error al guardar el alumno");
    }
  };

  // elimina un alumno por su id
  const handleDeleteProfesor = async (idProfesor) => {
    try {
      await axios.delete(`${API_URL}/${idProfesor}`);
      fetchProfesor(); // refresca la lista de alumnos
    } catch (err) {
      setError("error al eliminar el alumno");
    }
  };

  // carga los datos de un alumno en el formulario para editar
  const handleEditProfesor = (profesor) => {
    setSelectedProfesor(profesor); // selecciona la carrera para editar
    setNewProfesor({
      nombreProfesor: profesor.nombreProfesor,
      titulo: profesor.titulo,
      especialidad: profesor.especialidad,
      telefono: profesor.telefono,
    });
    setShowProfesorForm(true);
  };
// esto es lo que se muestra en la pagina y es lo divertido :)
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen p-8">
      {/* Titulo principal */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            Gestion de Profesores
          </span>
        </h1>
        <p className="text-sm text-gray-600 mt-2">Este es mi proyecto final de web</p>
      </header>

      {/* Tabla con alumnos */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Profesores</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Titulo</th>
              <th className="p-4 text-left">Especialidad</th>
              <th className="p-4 text-left">Telefono</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* aqui se mapean los alumnos para mostrarlos en la tabla */}
            {profesores.map((profesor) => (
              <tr key={profesor.idProfesor} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{profesor.nombreProfesor}</td>
                <td className="p-4">{profesor.titulo}</td>
                <td className="p-4">{profesor.especialidad}</td>
                <td className="p-4">{profesor.telefono}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditProfesor(profesor)}
                    className="text-blue-500 hover:underline"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteProfesor(profesor.idProfesor)}
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
          onClick={() => setShowProfesorForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="inline-block mr-2" /> Nuevo Profesor
        </button>
      </div>

      {showProfesorForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedProfesor ? "Editar Profesor" : "Nuevo Profesor"}</h3>
            <input
              type="text"
              placeholder="Nombre del profesor"
              value={newProfesor.nombreProfesor}
              onChange={(e) => setNewProfesor({ ...newProfesor, nombreProfesor: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Titulo"
              value={newProfesor.titulo}
              onChange={(e) => setNewProfesor({ ...newProfesor, titulo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Especialidad"
              value={newProfesor.especialidad}
              onChange={(e) => setNewProfesor({ ...newProfesor, especialidad: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Telefono"
              value={newProfesor.telefono}
              onChange={(e) => setNewProfesor({ ...newProfesor, telefono: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveProfesor} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowProfesorForm(false);
                  setNewProfesor(null);
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
        <Link to="/alumnos" className="text-blue-500 hover:underline text-lg">
          Gestionar Alumnos <ArrowRight />
        </Link>
      </footer>
    </div>
  );
};

export default AppProfesores;
