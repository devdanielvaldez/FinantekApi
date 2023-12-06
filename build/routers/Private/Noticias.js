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
const Noticias_1 = __importDefault(require("../../controllers/Private/Noticias"));
const router = express_1.default.Router();
const controller = new Noticias_1.default();
router.post("/registrar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.registrarNoticia(_req.body);
    return res.status(response.status).json(response);
}));
router.get('/empresa/:empresa_id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getNoticiasByEmpresa(_req.params.empresa_id);
    return res.status(response.status).json(response);
}));
router.put('/update/:noticia_id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.updateNoticia(_req.params.noticia_id, _req.body);
    return res.status(response.status).json(response);
}));
router.delete('/delete/:noticia_id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.deleteNoticia(_req.params.noticia_id);
    return res.status(response.status).json(response);
}));
exports.default = router;
