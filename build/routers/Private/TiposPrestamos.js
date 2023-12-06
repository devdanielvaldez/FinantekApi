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
const TiposPrestamos_1 = __importDefault(require("../../controllers/Private/TiposPrestamos"));
const router = express_1.default.Router();
const controller = new TiposPrestamos_1.default();
router.post("/registrar", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.registerLoanType(_req.body);
    return res.status(response.status).json(response);
}));
router.get('/por-empresa/:empresa_id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.getLoanTypesByCompany(_req.body);
    return res.status(response.status).json(response);
}));
router.put('/actualizar', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield controller.updateLoanType(_req.body);
    return res.status(response.status).json(response);
}));
exports.default = router;
