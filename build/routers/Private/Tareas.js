"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tareas_1 = __importDefault(require("../../controllers/Private/Tareas")); // Asegúrate de importar el controlador correcto
const router = express_1.default.Router();
const controller = new Tareas_1.default();
router.post("/crear", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.crearTarea(req.body);
    return res.status(response.status).json(response);
}));
router.put("/update/:tarea_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.actualizarTarea(req.params.tarea_id, req.body);
    return res.status(response.status).json(response);
}));
router.delete("/delete/:tarea_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.eliminarTarea(req.params.tarea_id);
    return res.status(response.status).json(response);
}));
router.get('/mis-tareas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.obtenerMisTareas(req.query.empleado_id, req.query.supervisor_id);
    return res.status(response.status).json(response);
}));
// Puedes agregar más rutas según tus necesidades, como obtener todas las tareas de un empleado o supervisor, etc.
exports.default = router;
