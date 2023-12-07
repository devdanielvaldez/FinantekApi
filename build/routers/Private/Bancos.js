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
const Bancos_1 = __importDefault(require("../../controllers/Private/Bancos"));
const decodedToken_1 = __importDefault(require("../../api/middlewares/decodedToken"));
const router = express_1.default.Router();
const controller = new Bancos_1.default();
router.post("/registrar", decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.registrarBanco(_req.body, _req);
    return res.status(response.status).json(response);
}));
router.get("/ver-todos", decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.verTodosLosBancos(_req);
    return res.status(response.status).json(response);
}));
router.get("/ver/:banco_id", decodedToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.verBanco(req.params.banco_id);
    return res.status(response.status).json(response);
}));
router.put("/actualizar/:banco_id", decodedToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.actualizarBanco(req.params.banco_id, req.body);
    return res.status(response.status).json(response);
}));
router.delete("/eliminar/:banco_id", decodedToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.eliminarBanco(req.params.banco_id);
    return res.status(response.status).json(response);
}));
exports.default = router;
