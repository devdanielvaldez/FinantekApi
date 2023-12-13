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
const prestamos_1 = require("./../../api/utils/prestamos");
const tsoa_1 = require("tsoa");
const mysql_connector_1 = require("../../api/utils/mysql.connector");
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
let PrestamoController = class PrestamoController {
    generarAmortizacionPrestamo(datosPrestamo, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // const empId = token.dataUsuario.emp_id.empresa_id;
            // console.log(empId);
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                console.log(empId);
                const { fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, cuota_seguro, numeroDeMeses, solicitudId } = datosPrestamo;
                const loan = (0, prestamos_1.generarPlanPrestamo)(fecha_inicial, +monto_aprobado, +tasa_interes, +cuota_seguro, frecuencia_pago, +numeroDeMeses, frecuenciasDias);
                var n_cuota = 1;
                for (const l of loan) {
                    yield (0, mysql_connector_1.execute)(`INSERT INTO amortizacion (
              solicitudId,
              fecha_pago, 
              cuotaCapital, 
              cuotaInteres, 
              cuotaSeguro, 
              montoPendientePrestamo, 
              montoTotalAPagar, 
              estado,
              n_cuota,
              emp_id
          ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          );
          `, [
                        solicitudId,
                        l.fecha_pago,
                        l.cuotaCapital,
                        l.cuotaInteres,
                        l.cuotaSeguro,
                        l.montoPendientePrestamo,
                        l.montoTotalAPagar,
                        'PE',
                        n_cuota++,
                        empId
                    ]);
                }
                return {
                    ok: true,
                    msg: "Amortizacion generada correctamente",
                    status: 200,
                    data: loan
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema al generar el préstamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    crearYRegistrarPrestamo(datosPrestamo, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const { fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, cuota_seguro, numeroDeMeses, solicitud_id } = datosPrestamo;
                // Aquí asumimos que generarPlanPrestamo es una función que calcula los detalles del préstamo
                const planPrestamo = (0, prestamos_1.generarPlanPrestamo)(fecha_inicial, monto_aprobado, tasa_interes, cuota_seguro, frecuencia_pago, numeroDeMeses, frecuenciasDias);
                const cantidad_cuotas = planPrestamo.length;
                const cuota_actual = 1; // Comienza en la primera cuota
                const prestamo_fecha_pago = planPrestamo[0].fecha_pago; // Fecha de pago de la primera cuota
                const fecha_final = planPrestamo[planPrestamo.length - 1].fecha_pago; // Fecha de pago de la última cuota
                const prestamo_monto_cuotas = planPrestamo[0].montoTotalAPagar; // Monto de la cuota total (incluyendo seguro)
                const prestamo_fecha_ultimo_cierre = new Date().toISOString().split('T')[0]; // Fecha actual como último cierre
                const prestamo_balance_actual = monto_aprobado; // El balance inicial es el monto aprobado
                const prestamo_cuota_capital = planPrestamo[0].cuotaCapital;
                const prestamo_cuota_interes = planPrestamo[0].cuotaInteres;
                const prestamo_frecuencia = datosPrestamo.frecuencia_pago;
                const prestamo_mora = 0; // Inicialmente, no hay mora
                const queryObtener = 'SELECT ultimo_numero FROM secuencia_prestamo WHERE id = 1';
                const resultado = yield (0, mysql_connector_1.execute)(queryObtener);
                const ultimoNumero = resultado[0].ultimo_numero;
                // Incrementar el número para el nuevo préstamo
                const nuevoNumero = ultimoNumero + 1;
                // Actualizar el último número en la base de datos
                const queryActualizar = 'UPDATE secuencia_prestamo SET ultimo_numero = ? WHERE id = 1';
                yield (0, mysql_connector_1.execute)(queryActualizar, [nuevoNumero]);
                // Construir la consulta SQL para insertar el nuevo préstamo en la base de datos
                const insertQuery = `
          INSERT INTO prestamos (solicitud_id, cantidad_cuotas, cuota_actual, numero_prestamo, prestamo_fecha_pago, fecha_inicio, fecha_final, prestamo_monto_cuotas, prestamo_fecha_ultimo_cierre, prestamo_balance_actual, prestamo_cuota_capital, prestamo_cuota_interes, prestamo_cuota_seguro, prestamo_frecuencia, prestamo_mora, prestamo_tipo_cuota, n_cuota, emp_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
                // Valores a insertar (deberás calcular o definir estos valores según tu lógica de negocio)
                const values = [
                    solicitud_id,
                    cantidad_cuotas,
                    cuota_actual,
                    nuevoNumero,
                    prestamo_fecha_pago,
                    fecha_inicial,
                    fecha_final,
                    prestamo_monto_cuotas,
                    prestamo_fecha_ultimo_cierre,
                    prestamo_balance_actual,
                    prestamo_cuota_capital,
                    prestamo_cuota_interes,
                    cuota_seguro,
                    prestamo_frecuencia,
                    prestamo_mora,
                    '1',
                    1,
                    empId
                ];
                console.log(values);
                // Ejecutar la consulta
                yield (0, mysql_connector_1.execute)(insertQuery, values);
                return {
                    ok: true,
                    msg: "Préstamo creado y registrado con éxito",
                    status: 200
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema al registrar el préstamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    pagarCuota() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/generar-amortizacion"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "generarAmortizacionPrestamo", null);
__decorate([
    (0, tsoa_1.Post)('/generar-prestamo'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "crearYRegistrarPrestamo", null);
__decorate([
    (0, tsoa_1.Post)('/pagar-cuota'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "pagarCuota", null);
PrestamoController = __decorate([
    (0, tsoa_1.Route)("/api/prestamos"),
    (0, tsoa_1.Tags)("Prestamos")
], PrestamoController);
exports.default = PrestamoController;
