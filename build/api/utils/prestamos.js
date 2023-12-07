"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarPlanPrestamo = void 0;
const moment_1 = __importDefault(require("moment"));
const generarPlanPrestamo = (fechaInicio, montoPrestamo, tasaInteres, cuotaSeguro, frecuenciaPago, numeroDeMeses, frecuenciasDias) => {
    let fechaPago = (0, moment_1.default)(fechaInicio);
    let saldoInsoluto = montoPrestamo;
    const amortizaciones = [];
    const cuotaInteresFija = montoPrestamo * tasaInteres / 100;
    const cuotaSeguroFija = montoPrestamo * cuotaSeguro / 100;
    // Validar si la frecuencia de pago es anual y el número de meses es menor a un año
    if (frecuenciaPago === 'AN' && numeroDeMeses < 12) {
        throw new Error("La cantidad de meses debe ser al menos 12 para pagos anuales.");
    }
    const totalPagos = Math.ceil(numeroDeMeses / (frecuenciasDias[frecuenciaPago] / 30));
    const cuotaCapitalFija = montoPrestamo / totalPagos;
    while (saldoInsoluto > 0) {
        let cuotaCapital = Math.min(cuotaCapitalFija, saldoInsoluto);
        saldoInsoluto -= cuotaCapital;
        amortizaciones.push({
            fecha_pago: fechaPago.format('YYYY-MM-DD'),
            cuotaCapital: Math.ceil(cuotaCapital),
            cuotaInteres: Math.ceil(cuotaInteresFija),
            cuotaSeguro: Math.ceil(cuotaSeguroFija),
            montoPendientePrestamo: Math.ceil(saldoInsoluto),
            montoTotalAPagar: Math.ceil(cuotaCapital + cuotaInteresFija + cuotaSeguroFija)
        });
        fechaPago = fechaPago.add(frecuenciasDias[frecuenciaPago], 'days');
    }
    return amortizaciones;
};
exports.generarPlanPrestamo = generarPlanPrestamo;
// Ejemplo de uso
const frecuenciasDias = {
    DI: 1,
    SM: 7,
    CT: 14,
    QU: 15,
    ME: 30,
    BM: 60,
    TM: 90,
    SEM: 180,
    AN: 360
};
