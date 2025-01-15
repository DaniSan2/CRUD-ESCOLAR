import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Plus, Edit2, Trash2, ArrowRight } from "lucide-react";
import axios from "axios";

// url de la api dani, yo uso el puerto 5000 pero si tienes broncas se puede cambiar
const API_URL = "http://127.0.0.1:5000/grupos"; // asegurate que corra bien este es muy importante

const AppGrupos = () => { // lista de carreras
  const [grupos, setGrupos] = useState([]);
  const [carrera, setCarreras] = useState([]);
  const [alumnos, setAlumnos] = useState([]); // lista de carreras // lista de carreras // lista de carreras
  const [error, setError] = useState(null); // para manejar errores
  const [showGrupoForm, setShowGrupoForm] = useState(false); // muestra u oculta el formulario
  const [selectedGrupo, setSelectedGrupo] = useState(null); // guarda la carrera seleccionada para editar
  
  const [newGrupo, setNewGrupo] = useState({
    nombreGrupo: "",
    idCarrera: "",
    semestre: "",
  });
  

  // trae los datos de los alumnos desde la api
  const fetchGrupos = async () => {
    try {
      const response = await axios.get(API_URL);
      setGrupos(response.data);
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

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/alumnos"); // recuerda revisar que corran bien estos urls
      setAlumnos(response.data);
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  // se ejecuta al cargar la pagina
  useEffect(() => {
    fetchGrupos();
    fetchAlumnos();
    fetchCarreras();
  }, []);

  // guarda o actualiza un alumno
  const handleSaveGrupo = async () => {
    try {
      if (selectedGrupo) {
        await axios.put(`${API_URL}/${selectedGrupo.idGrupo}`, newGrupo, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(API_URL, newGrupo, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchGrupos(); // refresca la lista de alumnos
      setShowGrupoForm(false); // cierra el form
      setSelectedGrupo(null); // limpia la seleccion
      setNewGrupo({ nombreGrupo: "", idCarrera: "", semestre: "" });
    } catch (err) {
      setError("error al guardar el alumno");
    }
  };

  // elimina un alumno por su id
  const handleDeleteGrupo = async (idGrupo) => {
    try {
      await axios.delete(`${API_URL}/${idGrupo}`);
      fetchGrupos(); // refresca la lista de alumnos
    } catch (err) {
      setError("error al eliminar el alumno");
    }
  };

  // carga los datos de un alumno en el formulario para editar
  const handleEditGrupo = (grupo) => {
    setSelectedGrupo(grupo); // selecciona la carrera para editar
    setNewGrupo({
      nombreGrupo: grupo.nombreGrupo,
      idCarrera: grupo.idCarrera,
      semestre: grupo.semestre,
    });
    setShowGrupoForm(true);
  };
  
// esto es lo que se muestra en la pagina y es lo divertido :)
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen p-8">
      {/* Titulo principal */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            Gestion de Grupos
          </span>
        </h1>
        <p className="text-sm text-gray-600 mt-2">Este es mi proyecto final de web</p>
      </header>

      {/* Tabla con alumnos */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Grupos</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">idCarrera</th>
              <th className="p-4 text-left">Semestre</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* aqui se mapean los alumnos para mostrarlos en la tabla */}
            {grupos.map((grupo) => (
              <tr key={grupo.idGrupo} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{grupo.nombreGrupo}</td>
                <td className="p-4">{grupo.idCarrera}</td>
                <td className="p-4">{grupo.semestre}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEditGrupo(grupo)}
                    className="text-blue-500 hover:underline"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteGrupo(grupo.idGrupo)}
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
          onClick={() => setShowGrupoForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="inline-block mr-2" /> Nuevo Grupo
        </button>
      </div>
      
      {showGrupoForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedGrupo ? "Editar Grupo" : "Nuevo Grupo"}</h3>
            <input
              type="text"
              placeholder="Nombre de la carrera"
              value={newGrupo.nombreGrupo}
              onChange={(e) => setNewGrupo({ ...newGrupo, nombreGrupo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="number"
              placeholder="IdCarrea"
              value={newGrupo.idCarrera}
              onChange={(e) => setNewGrupo({ ...newGrupo, idCarrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Semestre"
              value={newGrupo.semestre}
              onChange={(e) => setNewCarrera({ ...newGrupo, semestre: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveGrupo} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowGrupoForm(false);
                  setSelectedGrupo(null);
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
        <Link to="/alumnos" className="text-blue-500 hover:underline text-lg">
          Gestionar Alumnos <ArrowRight />
        </Link>
      </footer>
    </div>
  );
};

export default AppGrupos;
