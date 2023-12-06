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
const PlantillaCSV_1 = __importDefault(require("../../controllers/Private/PlantillaCSV"));
const router = express_1.default.Router();
const controller = new PlantillaCSV_1.default();
router.post("/plantillas-csv", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.crearPlantillaCSV(_req.body);
    return res.status(response.status).json(response);
}));
router.delete("/plantillas-csv/:plantilla_id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.eliminarPlantillaCSV(_req.params.plantilla_id);
    return res.status(response.status).json(response);
}));
router.put("/plantillas-csv/:plantilla_id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.actualizarPlantillaCSV(_req.params.plantilla_id, _req.body);
    return res.status(response.status).json(response);
}));
router.get("/plantillas-csv/:plantilla_id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.obtenerPlantillaCSV(_req.params.plantilla_id);
    return res.status(response.status).json(response);
}));
router.get("/plantillas-csv/empresa/:empresa_id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.obtenerTodasPlantillasEmpresa(_req.params.empresa_id);
    return res.status(response.status).json(response);
}));
exports.default = router;
