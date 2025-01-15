
import Alumnos from "./src/pages/AppAlumnos";
import Carreras from "./src/pages/AppCarreras";
import Grupos from "./src/pages/AppGrupos";
import Materias from "./src/pages/AppMaterias";
import Profesores from "./src/pages/AppProfesores";

const routes = [
  {
    path: '/',
    component: (
      <>
         <Alumnos />
    </>
    ),
  },
  {
    path: '/Carreras',
    component: (
      <>
         <Carreras />
    </>
    ),
  },
  {
    path: '/Grupos',
    component: (
      <>
         <Grupos />
    </>
    ),
  },
  {
    path: '/Materias',
    component: (
      <>
         <Materias />
    </>
    ),
  },
  {
    path: '/Profesores',
    component: (
      <>
         <Profesores />
    </>
    ),
  }
];


export default routes;
