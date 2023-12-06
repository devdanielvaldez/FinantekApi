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
const Solicitudes_1 = __importDefault(require("../../controllers/Private/Solicitudes"));
const router = express_1.default.Router();
const controller = new Solicitudes_1.default();
router.post("/registrar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.createLoanRequest(_req.body);
    return res.status(response.status).json(response);
}));
router.get("/solicitudes/:empresa_id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getAllLoanRequestsByCompany(_req.params.empresa_id);
    return res.status(response.status).json(response);
}));
router.get("/solicitudes/:empresa_id/:id", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getLoanRequestByIdAndCompany(_req.params.empresa_id, _req.params.id);
    return res.status(response.status).json(response);
}));
router.put("/solicitudes/:empresa_id/:id/editar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.updateLoanRequest(_req.params.empresa_id, _req.params.id, _req.body);
    return res.status(response.status).json(response);
}));
router.put("/solicitudes/:empresa_id/:solicitud_id/actualizar-estado", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.updateLoanRequest(_req.params.empresa_id, _req.params.solicitud_id, _req.body);
    return res.status(response.status).json(response);
}));
router.delete("/solicitudes/:empresa_id/:id/eliminar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getLoanRequestByIdAndCompany(_req.params.empresa_id, _req.params.id);
    return res.status(response.status).json(response);
}));
exports.default = router;
