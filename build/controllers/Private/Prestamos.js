"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const tsoa_1 = require("tsoa");
const mysql_connector_1 = require("../../api/utils/mysql.connector");
class PrestamoController {
    generarPrestamo(datosPrestamo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { solicitud_id, frecuencia_pago, tipo_cuota, fecha_inicial } = datosPrestamo;
                const solicitud = yield (0, mysql_connector_1.execute)(`SELECT * FROM solicitudes_prestamo WHERE solicitud_id = ? AND estado_solicitud = 'AP'`, [solicitud_id]);
                if (!solicitud || solicitud.length === 0) {
                    return {
                        ok: false,
                        msg: "La solicitud de préstamo no está aprobada o no existe",
                        status: 400,
                    };
                }
                const tipoPrestamoId = solicitud[0].tipo_prestamo_id;
                const tipoPrestamo = yield (0, mysql_connector_1.execute)(`SELECT * FROM tipos_prestamos WHERE tipo_prestamo_id = ?`, [tipoPrestamoId]);
                if (!tipoPrestamo || tipoPrestamo.length === 0) {
                    return {
                        ok: false,
                        msg: "El tipo de préstamo asociado a la solicitud no existe",
                        status: 400,
                    };
                }
                const montoAprobado = solicitud[0].monto_aprobado;
                const tasaInteres = tipoPrestamo[0].tasa_interes; // Suponiendo que el nombre del campo de tasa de interés es 'tasa_interes'
                const porcentajeCuotaCapital = 50; // Porcentaje de la cuota de capital
                const cuotaFijaCapital = (porcentajeCuotaCapital / 100) * montoAprobado;
                const insertPrestamoResult = yield (0, mysql_connector_1.execute)(`INSERT INTO prestamos 
          (solicitud_id, prestamo_monto_cuotas, prestamo_frecuencia, prestamo_tipo_cuota) 
          VALUES (?, ?, ?, ?)`, [solicitud_id, montoAprobado, frecuencia_pago, tipo_cuota]);
                if (insertPrestamoResult.affectedRows > 0) {
                    const prestamoId = insertPrestamoResult.insertId;
                    const amortizaciones = []; // Almacenará las amortizaciones generadas
                    // Convertir la fecha inicial proporcionada a un objeto de fecha
                    const fechaInicio = new Date(fecha_inicial);
                    // Función para calcular la siguiente fecha de pago basada en la frecuencia
                    const calcularSiguienteFechaPago = (fecha, frecuencia) => {
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
                        const diasFrecuencia = frecuenciasDias[frecuencia];
                        const siguienteFechaPago = new Date(fecha);
                        siguienteFechaPago.setDate(siguienteFechaPago.getDate() + diasFrecuencia);
                        return siguienteFechaPago;
                    };
                    // Lógica para generar las amortizaciones según la frecuencia y el tipo de cuota
                    let fechaPago = fechaInicio;
                    let saldoInsoluto = montoAprobado; // Se inicia con el monto aprobado
                    while (saldoInsoluto > 0) {
                        let cuotaCapital = 0;
                        let cuotaInteres = 0;
                        let cuotaSeguro = 0;
                        if (tipo_cuota === 1) {
                            // Cuota sobre saldo insoluto
                            cuotaInteres = saldoInsoluto * tasaInteres;
                            cuotaCapital = cuotaFijaCapital;
                            cuotaSeguro = saldoInsoluto * 0.5;
                        }
                        else if (tipo_cuota === 2) {
                            // Capital fijo más intereses variables
                            cuotaCapital = cuotaFijaCapital;
                            cuotaInteres = saldoInsoluto * tasaInteres;
                            cuotaSeguro = saldoInsoluto * 0.5;
                        }
                        else if (tipo_cuota === 3) {
                            // Capital e interés fijo sobre saldo insoluto
                            const cuotaTotal = cuotaFijaCapital + (saldoInsoluto * tasaInteres);
                            cuotaInteres = saldoInsoluto * tasaInteres;
                            cuotaCapital = cuotaTotal - cuotaInteres;
                            cuotaSeguro = saldoInsoluto * 0.5;
                        }
                        else if (tipo_cuota === 4) {
                            // Capital al vencimiento del préstamo
                            cuotaCapital = saldoInsoluto;
                            cuotaInteres = saldoInsoluto * tasaInteres;
                            cuotaSeguro = saldoInsoluto * 0.5;
                        }
                        // Insertar amortización en la base de datos
                        const fechaPagoFormatoSQL = fechaPago.toISOString().split('T')[0];
                        yield (0, mysql_connector_1.execute)(`INSERT INTO amortizaciones_prestamo 
          (prestamo_id, fecha_pago, cuota_capital, cuota_interes, cuota_seguro, saldo_insoluto) 
          VALUES (?, ?, ?, ?, ?, ?)`, [prestamoId, fechaPagoFormatoSQL, cuotaCapital, cuotaInteres, cuotaSeguro, saldoInsoluto]);
                        // Guardar la amortización generada en la lista
                        amortizaciones.push({
                            fecha_pago: fechaPagoFormatoSQL,
                            cuota_capital: cuotaCapital,
                            cuota_interes: cuotaInteres,
                            cuota_seguro: cuotaSeguro,
                            saldo_insoluto: saldoInsoluto
                        });
                        // Calcular la siguiente fecha de pago
                        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuencia_pago);
                        // Actualizar el saldo insoluto para la próxima amortización
                        saldoInsoluto -= cuotaCapital;
                    }
                    return {
                        ok: true,
                        msg: "Préstamo generado exitosamente",
                        amortizaciones: amortizaciones,
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se pudo generar el préstamo",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al generar el préstamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
}
exports.default = PrestamoController;
__decorate([
    (0, tsoa_1.Post)("/prestamos/generar"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "generarPrestamo", null);
