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
exports.generarNumeroPrestamo = exports.generarPlanPrestamo = exports.formatDate = exports.verifyPassword = exports.hashPassword = exports.generatePassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const mysql_connector_1 = require("./mysql.connector");
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
const verifyPassword = (hashPassword, textPlainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const passValidation = yield bcrypt_1.default.compare(textPlainPassword, hashPassword);
    return passValidation;
});
exports.verifyPassword = verifyPassword;
const formatDate = (date, format) => {
    switch (format) {
        case 'n':
            return (0, moment_1.default)(date).locale('es-Do').format('L');
        case 's':
            return (0, moment_1.default)(date).locale('es-Do').format('lll');
    }
};
exports.formatDate = formatDate;
const generarPlanPrestamo = (fechaInicial, montoAprobado, tasaInteresAnual, cuotaSeguro, frecuenciaPago, numeroDeMeses) => {
    const tasaInteresMensual = tasaInteresAnual / 12 / 100;
    let saldo = montoAprobado;
    let fecha = new Date(fechaInicial);
    let planPrestamo = [];
    // Calcular la cuota mensual (sin incluir seguro)
    const cuotaMensual = montoAprobado * tasaInteresMensual / (1 - Math.pow(1 + tasaInteresMensual, -numeroDeMeses));
    for (let i = 0; i < numeroDeMeses; i++) {
        const interes = saldo * tasaInteresMensual;
        const capital = cuotaMensual - interes;
        saldo -= capital;
        // Añadir la cuota de seguro a la cuota total
        const cuotaTotal = cuotaMensual + cuotaSeguro;
        planPrestamo.push({
            cuota: i + 1,
            fechaPago: fecha.toISOString().split('T')[0],
            capital: capital,
            interes: interes,
            cuotaTotal: cuotaTotal,
            saldoRestante: saldo
        });
        // Incrementar la fecha al próximo período de pago
        fecha.setMonth(fecha.getMonth() + 1);
    }
    return planPrestamo;
};
exports.generarPlanPrestamo = generarPlanPrestamo;
const generarNumeroPrestamo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el último número de préstamo de la base de datos
        const queryObtener = 'SELECT ultimo_numero FROM secuencia_prestamo WHERE id = 1';
        const resultado = yield (0, mysql_connector_1.execute)(queryObtener, []);
        const ultimoNumero = resultado[0].ultimo_numero;
        // Incrementar el número para el nuevo préstamo
        const nuevoNumero = ultimoNumero + 1;
        // Actualizar el último número en la base de datos
        const queryActualizar = 'UPDATE secuencia_prestamo SET ultimo_numero = ? WHERE id = 1';
        yield (0, mysql_connector_1.execute)(queryActualizar, [nuevoNumero]);
        // Devolver el nuevo número de préstamo
        return nuevoNumero;
    }
    catch (error) {
        console.error('Error al generar el número de préstamo:', error);
        throw error;
    }
});
exports.generarNumeroPrestamo = generarNumeroPrestamo;
