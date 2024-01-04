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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cierreExecute = void 0;
const mysql_connector_1 = require("../utils/mysql.connector");
const registrarIncrementarAtraso = (numeroPrestamo, numeroCuota) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryExistente = 'SELECT dias_atraso FROM cuotas_retrasadas WHERE numero_prestamo = ? AND numero_cuota = ?';
        const resultado = yield (0, mysql_connector_1.execute)(queryExistente, [numeroPrestamo, numeroCuota]);
        if (resultado.length > 0) {
            // Incrementa los días de atraso en uno
            const diasAtrasoActualizados = resultado[0].dias_atraso + 1;
            const queryActualizar = 'UPDATE cuotas_retrasadas SET dias_atraso = ? WHERE numero_prestamo = ? AND numero_cuota = ?';
            yield (0, mysql_connector_1.execute)(queryActualizar, [diasAtrasoActualizados, numeroPrestamo, numeroCuota]);
        }
        else {
            // Inserta un nuevo registro con un día de atraso
            const queryInsertar = 'INSERT INTO cuotas_retrasadas (numero_prestamo, numero_cuota, dias_atraso) VALUES (?, ?, 1)';
            yield (0, mysql_connector_1.execute)(queryInsertar, [numeroPrestamo, numeroCuota]);
        }
    }
    catch (error) {
        console.error('Error al registrar o incrementar atraso:', error);
        throw error;
    }
});
const eliminarCuotaPagada = (numeroPrestamo, numeroCuota) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryEstado = 'SELECT estado FROM amortizacion WHERE solicitudId = ? AND n_cuota = ?';
        const estadoCuota = yield (0, mysql_connector_1.execute)(queryEstado, [numeroPrestamo, numeroCuota]);
        if (estadoCuota.length > 0 && estadoCuota[0].estado === 'PA') {
            // Elimina la cuota de cuotas_retrasadas
            const queryEliminar = 'DELETE FROM cuotas_retrasadas WHERE numero_prestamo = ? AND numero_cuota = ?';
            yield (0, mysql_connector_1.execute)(queryEliminar, [numeroPrestamo, numeroCuota]);
        }
    }
    catch (error) {
        console.error('Error al eliminar cuota pagada:', error);
        throw error;
    }
});
const cierreExecute = () => {
    console.log('iniciando cierre');
};
exports.cierreExecute = cierreExecute;
