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
const Prestamos_1 = __importDefault(require("../../controllers/Private/Prestamos"));
const decodedToken_1 = __importDefault(require("../../api/middlewares/decodedToken"));
const router = express_1.default.Router();
const controller = new Prestamos_1.default();
router.post("/generar-amortizacion", decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.generarAmortizacionPrestamo(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.get("/all", decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.allPrestamos(_req);
    return res.status(response.status).json(response);
}));
router.post("/generar-amortizacion-preview", decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.generarAmortizacionPreview(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.post('/generar-prestamo', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.crearYRegistrarPrestamo(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.post('/pagar-cuota', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.pagarCuota(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.post('/aplicar-abono', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.aplicarAbono(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.get('/:id', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getLoanById(_req.params.id);
    return res.status(response.status).json(response);
}));
router.get('/atraso', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.prestamosAtraso(_req);
    return res.status(response.status).json(response);
}));
router.get('/prestamo-reporte/:id', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getLoanReportById(_req.params.id);
    return res.status(response.status).json(response);
}));
exports.default = router;
