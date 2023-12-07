"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(403).send({ message: 'No se proporcionó token' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'token');
        req.dataUsuario = decoded; // Agrega los datos del usuario a la solicitud
        next(); // Continúa con el siguiente middleware
    }
    catch (error) {
        return res.status(401).send({ message: 'Token inválido' });
    }
};
exports.default = validateToken;
