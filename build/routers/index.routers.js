"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Empresas_1 = __importDefault(require("./Private/Empresas"));
const Personas_1 = __importDefault(require("./Private/Personas"));
const Empleados_1 = __importDefault(require("./Private/Empleados"));
const Noticias_1 = __importDefault(require("./Private/Noticias"));
const Tareas_1 = __importDefault(require("./Private/Tareas"));
const Bancos_1 = __importDefault(require("./Private/Bancos"));
const Clientes_1 = __importDefault(require("./Private/Clientes"));
const TiposPrestamos_1 = __importDefault(require("./Private/TiposPrestamos"));
const Solicitudes_1 = __importDefault(require("./Private/Solicitudes"));
const PlantillasCSV_1 = __importDefault(require("./Private/PlantillasCSV"));
const Auth_1 = __importDefault(require("./Private/Auth"));
const Prestamos_1 = __importDefault(require("./Private/Prestamos"));
const router = express_1.default.Router();
router.use('/auth', Auth_1.default);
router.use('/empresas', Empresas_1.default);
router.use('/personas', Personas_1.default);
router.use('/empleados', Empleados_1.default);
router.use('/noticias', Noticias_1.default);
router.use('/tareas', Tareas_1.default);
router.use('/bancos', Bancos_1.default);
router.use('/clientes', Clientes_1.default);
router.use('/tipos-prestamos', TiposPrestamos_1.default);
router.use('/solicitudes-prestamo', Solicitudes_1.default);
router.use('/api/plantillas', PlantillasCSV_1.default);
router.use('/prestamos', Prestamos_1.default);
exports.default = router;
