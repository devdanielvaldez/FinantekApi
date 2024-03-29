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
const Empresas_1 = __importDefault(require("../../controllers/Private/Empresas"));
const decodedToken_1 = __importDefault(require("../../api/middlewares/decodedToken"));
const router = express_1.default.Router();
const controller = new Empresas_1.default();
router.post("/registrar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.registrarEmpresas(_req.body);
    console.log(response);
    return res.status(response.status).json(response);
}));
router.get('/all', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.consultarEmpresas(_req.query);
    return res.status(response.status).json(response);
}));
router.put('/actualizar', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.actualizarEmpresa(_req.body);
    return res.status(response.status).json(response);
}));
router.get('/empresa-conectada', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.empresaConectada(_req);
    return res.status(response.status).json(response);
}));
exports.default = router;
