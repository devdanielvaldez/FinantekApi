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
exports.hashPassword = exports.generatePassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generatePassword = () => {
    // Definir el tamaño del password en bytes (8 caracteres * 2 bytes por caracter hexadecimal)
    const tamañoPassword = 8;
    // Generar bytes aleatorios de forma segura
    const bytesAleatorios = crypto_1.default.randomBytes(tamañoPassword);
    // Convertir los bytes en una cadena hexadecimal
    const password = bytesAleatorios.toString('hex').slice(0, tamañoPassword);
    return password;
};
exports.generatePassword = generatePassword;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10; // Número de rondas de sal (más rondas, más seguro pero más lento)
    // Generar el hash del password
    const hash = yield bcrypt_1.default.hash(password, saltRounds);
    return hash;
});
exports.hashPassword = hashPassword;
