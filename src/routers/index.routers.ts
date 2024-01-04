import express from "express";
import Empresas from  './Private/Empresas';
import Personas from './Private/Personas';
import Empleados from "./Private/Empleados";
import Noticias from "./Private/Noticias";
import Tareas from "./Private/Tareas";
import Bancos from "./Private/Bancos";
import Clientes from "./Private/Clientes";
import TiposPrestamos from "./Private/TiposPrestamos";
import SolicitudesPrestamos from "./Private/Solicitudes";
import Plantillas from "./Private/PlantillasCSV";
import Auth from "./Private/Auth";
import Prestamos from "./Private/Prestamos";
import UtilsEnums from "./Private/UtilsEnums";
import Desembolso from "./Private/Desembolso";
import PreCierre from "./Private/Pre-Cierre";
import Roles from './Private/Roles';

const router = express.Router();

router.use('/auth', Auth);
router.use('/empresas', Empresas);
router.use('/personas', Personas);
router.use('/empleados', Empleados);
router.use('/noticias', Noticias);
router.use('/tareas', Tareas);
router.use('/bancos', Bancos);
router.use('/clientes', Clientes);
router.use('/tipos-prestamos', TiposPrestamos);
router.use('/solicitudes-prestamo', SolicitudesPrestamos);
router.use('/plantillas', Plantillas);
router.use('/prestamos', Prestamos);
router.use('/utils', UtilsEnums);
router.use('/solicitudes-desembolsar', Desembolso);
router.use('/pre-cierre', PreCierre);
router.use('/roles', Roles);

export default router;