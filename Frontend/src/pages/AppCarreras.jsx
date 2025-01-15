import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

// aqui va la url de la api dani, yo uso el puerto 5000 pero si tienes broncas se puede cambiar 
const API_URL = "http://127.0.0.1:5000/carreras"; // asegurate que corra bien este es muy importante

const AppCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [grupos, setGrupos] = useState([]); // lista de carreras
  const [alumnos, setAlumnos] = useState([]); // lista de carreras
  const [error, setError] = useState(null); // para manejar errores
  const [showCarreraForm, setShowCarreraForm] = useState(false); // muestra o oculta el formulario
  const [selectedCarrera, setSelectedCarrera] = useState(null); // guarda la carrera seleccionada para editar

  const [newCarrera, setNewCarrera] = useState({
    carrera: "",
    descripcionCarrera: "",
    semestres: "",
    plan: "",
  });

  // obtiene las carreras desde la api
  const fetchCarreras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCarreras(response.data); // guarda las carreras
    } catch (err) {
      setError("error al cargar las carreras");
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  // guarda o actualiza una carrera
  const handleSaveCarrera = async () => {
    try {
      if (selectedCarrera) {
        // actualiza la carrera si esta seleccionada
        await axios.put(`${API_URL}/${selectedCarrera.idCarrera}`, newCarrera);
      } else {
        // crea una nueva carrera si no hay seleccionada
        await axios.post(API_URL, newCarrera);
      }
      fetchCarreras(); // refresca la lista de carreraa
      setShowCarreraForm(false); // cierra el formulario
      setSelectedCarrera(null); // limpia la seleccion
      setNewCarrera({ carrera: "", descripcionCarrera: "", semestres: "", plan: "" }); // limpia el formulario
    } catch (err) {
      setError("error al guardar la carreraa");
    }
  };

  // elimina una carrera por su id
  const handleDeleteCarrera = async (idCarrera) => {
    try {
      await axios.delete(`${API_URL}/${idCarrera}`);
      fetchCarreras(); // refresca la lista
    } catch (err) {
      setError("erro al eliminar la carrera");
    }
  };

  // carga los datos de una carrera en el formulario para editar
  const handleEditCarrera = (carrera) => {
    setSelectedCarrera(carrera); // selecciona la carrera para editar
    setNewCarrera({
      carrera: carrera.carrera,
      descripcionCarrera: carrera.descripcionCarrera,
      semestres: carrera.semestres,
      plan: carrera.plan,
    });
    setShowCarreraForm(true);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            Gestion de Carreras
          </span>
        </h1>
        <p className="text-sm text-gray-600 mt-2">Organiza y administra las carreras disponibles</p>
      </header>

      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        <ArrowLeft className="inline-block mr-2" /> Volver a alumnos
      </Link>

      <Link to="/grupos" className="text-blue-500 hover:underline mb-4 inline-block">
        <ArrowLeft className="inline-block mr-2" /> Volver a grupos
      </Link>

      <Link to="/materias" className="text-blue-500 hover:underline mb-4 inline-block">
        <ArrowLeft className="inline-block mr-2" /> Volver a materias
      </Link>

      <Link to="/profesores" className="text-blue-500 hover:underline mb-4 inline-block">
        <ArrowLeft className="inline-block mr-2" /> Volver a profesores
      </Link>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded shadow mb-4">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Carreras</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">Carrera</th>
              <th className="p-4 text-left">Descripción</th>
              <th className="p-4 text-left">Semestres</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carreras.map((carrera) => (
              <tr key={carrera.idCarrera} className="border-b hover:bg-blue-100 transition">
                <td className="p-4">{carrera.carrera}</td>
                <td className="p-4">{carrera.descripcionCarrera}</td>
                <td className="p-4">{carrera.semestres}</td>
                <td className="p-4">{carrera.plan}</td>
                <td className="p-4 flex gap-4">
                  <button onClick={() => handleEditCarrera(carrera)} className="text-blue-500 hover:underline">
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteCarrera(carrera.idCarrera)}
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

      <div className="flex justify-center">
        <button
          onClick={() => setShowCarreraForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="inline-block mr-2" /> Nueva Carrera
        </button>
      </div>

      {showCarreraForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedCarrera ? "Editar Carrera" : "Nueva Carrera"}</h3>
            <input
              type="text"
              placeholder="Nombre de la carrera"
              value={newCarrera.carrera}
              onChange={(e) => setNewCarrera({ ...newCarrera, carrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Descripción"
              value={newCarrera.descripcionCarrera}
              onChange={(e) => setNewCarrera({ ...newCarrera, descripcionCarrera: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="number"
              placeholder="Semestres"
              value={newCarrera.semestres}
              onChange={(e) => setNewCarrera({ ...newCarrera, semestres: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Plan"
              value={newCarrera.plan}
              onChange={(e) => setNewCarrera({ ...newCarrera, plan: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveCarrera} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowCarreraForm(false);
                  setSelectedCarrera(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppCarreras;
