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
    generarAmortizacionPreview(datosPrestamo, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                console.log(empId);
                const { fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, cuota_seguro, numeroDeMeses } = datosPrestamo;
                const loan = (0, prestamos_1.generarPlanPrestamo)(fecha_inicial, +monto_aprobado, +tasa_interes, +cuota_seguro, frecuencia_pago, +numeroDeMeses, frecuenciasDias);
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
                yield (0, mysql_connector_1.execute)(`UPDATE solicitudes_prestamo SET monto_aprobado = ? WHERE solicitud_id = ?`, [monto_aprobado, solicitud_id]);
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
    pagarCuota(datosPago, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const { prestamoId, montoPago, metodo_pago, solicitudId } = datosPago;
                // 1. Registrar el pago en la tabla de pagos
                const queryPago = 'INSERT INTO pagos (prestamo_id, monto, fecha_pago, metodo_pago) VALUES (?, ?, NOW(), ?)';
                yield (0, mysql_connector_1.execute)(queryPago, [prestamoId, montoPago, metodo_pago]);
                // 2. Obtener la cuota actual del préstamo
                const queryCuotaActual = 'SELECT cuota_actual FROM prestamos WHERE prestamo_id = ?';
                const resultadoCuota = yield (0, mysql_connector_1.execute)(queryCuotaActual, [prestamoId]);
                const cuotaActual = resultadoCuota[0].cuota_actual;
                // 3. Actualizar el estado de la cuota en la tabla de amortización
                const queryActualizarAmortizacion = 'UPDATE amortizacion SET estado = ? WHERE solicitudId = ? AND n_cuota = ?';
                yield (0, mysql_connector_1.execute)(queryActualizarAmortizacion, ['PA', solicitudId, cuotaActual]);
                const findNextDate = yield (0, mysql_connector_1.execute)('SELECT fecha_pago FROM amortizacion WHERE n_cuota = ?', [+cuotaActual + 1]);
                // 4. Actualizar la cuota actual en la tabla de prestamos (pasar a la siguiente cuota)
                const queryActualizarPrestamo = 'UPDATE prestamos SET cuota_actual = ?, prestamo_fecha_pago = ? WHERE prestamo_id = ?';
                console.log(findNextDate);
                yield (0, mysql_connector_1.execute)(queryActualizarPrestamo, [+cuotaActual + 1, findNextDate[0].fecha_pago, prestamoId]);
                return {
                    ok: true,
                    msg: "Pago de la cuota realizado con éxito",
                    status: 200
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema al realizar el pago de la cuota",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    aplicarAbono(datosAbono, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const { prestamoId, montoAbono, metodo_pago, solicitudId } = datosAbono;
                // 1. Registrar el abono en la tabla de pagos
                const queryAbono = 'INSERT INTO abonos (prestamo_id, monto, fecha_abono, metodo_pago, emp_id) VALUES (?, ?, NOW(), ?, ?)';
                yield (0, mysql_connector_1.execute)(queryAbono, [prestamoId, montoAbono, metodo_pago, empId]);
                // 2. Obtener la cuota actual y sus detalles
                const queryCuotaActual = 'SELECT cuota_actual, prestamo_cuota_capital, prestamo_cuota_interes, prestamo_cuota_seguro, prestamo_mora FROM prestamos WHERE prestamo_id = ?';
                const prestamoActual = yield (0, mysql_connector_1.execute)(queryCuotaActual, [prestamoId]);
                let { cuota_actual, prestamo_cuota_capital, prestamo_cuota_interes, prestamo_cuota_seguro, prestamo_mora } = prestamoActual[0];
                let montoRestante = montoAbono;
                // 3. Aplicar el abono: intereses, mora, seguro, capital
                let montoUsado = 0;
                // Aplicar a la mora si no está en 0
                if (prestamo_mora > 0) {
                    montoUsado = Math.min(montoRestante, prestamo_mora);
                    prestamo_mora -= montoUsado;
                    montoRestante -= montoUsado;
                }
                console.log(montoRestante);
                // Aplicar al interés
                montoUsado = Math.min(montoRestante, prestamo_cuota_interes);
                prestamo_cuota_interes -= montoUsado;
                montoRestante -= montoUsado;
                console.log(montoRestante);
                // Aplicar al seguro
                montoUsado = Math.min(montoRestante, prestamo_cuota_seguro);
                prestamo_cuota_seguro -= montoUsado;
                montoRestante -= montoUsado;
                console.log(montoRestante);
                // Aplicar al capital
                montoUsado = Math.min(montoRestante, prestamo_cuota_capital);
                prestamo_cuota_capital -= montoUsado;
                montoRestante -= montoUsado;
                console.log(montoRestante);
                // 4. Actualizar la tabla prestamos con los nuevos montos
                const queryActualizarPrestamo = `
          UPDATE prestamos
          SET prestamo_cuota_capital = ?, 
              prestamo_cuota_interes = ?, 
              prestamo_cuota_seguro = ?, 
              prestamo_mora = ?
          WHERE prestamo_id = ?`;
                yield (0, mysql_connector_1.execute)(queryActualizarPrestamo, [prestamo_cuota_capital, prestamo_cuota_interes, prestamo_cuota_seguro, prestamo_mora, prestamoId]);
                // 5. Verificar y actualizar el estado en la tabla de amortización
                const esCuotaCompleta = prestamo_mora == 0 && prestamo_cuota_interes == 0 && prestamo_cuota_seguro == 0 && prestamo_cuota_capital == 0;
                const estadoCuota = esCuotaCompleta ? 'PA' : 'AB';
                const queryActualizarAmortizacion = 'UPDATE amortizacion SET estado = ? WHERE solicitudId = ? AND n_cuota = ?';
                yield (0, mysql_connector_1.execute)(queryActualizarAmortizacion, [estadoCuota, solicitudId, cuota_actual]);
                console.log(estadoCuota);
                if (esCuotaCompleta) {
                    const cuotaAmortizacion = yield (0, mysql_connector_1.execute)('SELECT cuotaCapital, cuotaInteres, cuotaSeguro, montoPendientePrestamo FROM amortizacion WHERE solicitudId = ? AND n_cuota = ?', [solicitudId, +cuota_actual + 1]);
                    console.log(cuotaAmortizacion);
                    // Avanzar a la siguiente cuota
                    yield (0, mysql_connector_1.execute)('UPDATE prestamos SET cuota_actual = cuota_actual + 1, prestamo_cuota_capital = ?, prestamo_cuota_interes = ?, prestamo_cuota_seguro = ?, prestamo_balance_actual = ?, cuota_actual = ? WHERE prestamo_id = ?', [cuotaAmortizacion[0].cuotaCapital, cuotaAmortizacion[0].cuotaInteres, cuotaAmortizacion[0].cuotaSeguro, cuotaAmortizacion[0].montoPendientePrestamo, +cuota_actual + 1, prestamoId]);
                }
                return {
                    ok: true,
                    msg: "Abono aplicado con éxito",
                    status: 200
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error al aplicar el abono",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    getLoanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // consultar el prestamo
                const getLoan = yield (0, mysql_connector_1.execute)('SELECT * FROM prestamos WHERE prestamo_id = ?', [id]);
                // consultar abonos del prestamo
                const getLoanAbono = yield (0, mysql_connector_1.execute)('SELECT * FROM abonos WHERE prestamo_id = ?', [id]);
                // consultar amortizacion del prestamo
                const getAmortizacionLoan = yield (0, mysql_connector_1.execute)('SELECT * FROM amortizacion WHERE solicitudId = ?', [getLoan[0].solicitud_id]);
                // consultar pagos del prestamo
                const getAllPaymentsByLoan = yield (0, mysql_connector_1.execute)('SELECT * FROM pagos WHERE prestamo_id = ?', [id]);
                return {
                    ok: true,
                    status: 200,
                    loan: getLoan,
                    abonos: getLoanAbono,
                    amortizacion: getAmortizacionLoan,
                    payments: getAllPaymentsByLoan
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error al consultar el prestamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    prestamosAtraso(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                // consultar el prestamo
                const getLoan = yield (0, mysql_connector_1.execute)('SELECT * FROM cuotas_retrasadas WHERE empId = ?', [empId]);
                return {
                    ok: true,
                    status: 200,
                    data: getLoan
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error al consultar el prestamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    ejecutarPreCierre() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    recibirDatosPali() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    sincronizarPali() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generarRecaudo() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    registrarRecaudo() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    allPrestamos(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const findLoans = yield (0, mysql_connector_1.execute)('SELECT * FROM prestamos WHERE emp_id = ?', [empId]);
                return {
                    ok: true,
                    status: 200,
                    data: findLoans
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
};
__decorate([
    (0, tsoa_1.Post)("/generar-amortizacion-preview"),
    (0, tsoa_1.Response)(200, "Consulta de personas satisfactoria", {
        ok: true,
        data: [],
        status: 200,
        msg: ""
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "generarAmortizacionPreview", null);
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
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "pagarCuota", null);
__decorate([
    (0, tsoa_1.Post)('/aplicar-abono'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "aplicarAbono", null);
__decorate([
    (0, tsoa_1.Get)('/:id'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "getLoanById", null);
__decorate([
    (0, tsoa_1.Get)('/atraso'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "prestamosAtraso", null);
__decorate([
    (0, tsoa_1.Post)('/ejecutar-pre-cierre'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "ejecutarPreCierre", null);
__decorate([
    (0, tsoa_1.Post)('/recibir-datos-pali'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "recibirDatosPali", null);
__decorate([
    (0, tsoa_1.Post)('/sincronizar-pali'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "sincronizarPali", null);
__decorate([
    (0, tsoa_1.Post)('/generar-recaudo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "generarRecaudo", null);
__decorate([
    (0, tsoa_1.Post)('/registrar-recaudo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "registrarRecaudo", null);
__decorate([
    (0, tsoa_1.Get)('/all'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "allPrestamos", null);
PrestamoController = __decorate([
    (0, tsoa_1.Route)("/api/prestamos"),
    (0, tsoa_1.Tags)("Prestamos")
], PrestamoController);
exports.default = PrestamoController;
