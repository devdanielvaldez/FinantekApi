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
const decodedToken_1 = __importDefault(require("../../api/middlewares/decodedToken"));
const UtilsEnums_1 = __importDefault(require("../../controllers/Private/UtilsEnums"));
const router = express_1.default.Router();
const controller = new UtilsEnums_1.default();
router.get('/provincias', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getProvincias(_req);
    return res.status(response.status).json(response);
}));
router.get('/municipios/:id', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getMunicipios(_req, _req.params.id);
    return res.status(response.status).json(response);
}));
router.get('/tipos-frecuencias', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.tiposFrecuencias();
    return res.status(response.status).json(response);
}));
router.get('/codes', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.codesPlantillas();
    return res.status(response.status).json(response);
}));
router.get('/prelacion', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.prelacionEnums();
    return res.status(response.status).json(response);
}));
router.post('/files', decodedToken_1.default, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.uploadFiles(_req);
    return res.status(response.status).json(response);
}));
exports.default = router;
