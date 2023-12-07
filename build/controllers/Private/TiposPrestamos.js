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
let LoanTypes = class LoanTypes {
    registerLoanType(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const { nombre_tipo, descripcion, tasa_interes, plazo_maximo_meses, monto_minimo, monto_maximo, gastos_legales, porcentaje_mora, dias_gracia, requisitos } = body;
                // Realizar la inserción en la base de datos con la información proporcionada
                const insertResult = yield (0, mysql_connector_1.execute)(`INSERT INTO tipos_prestamos 
        (nombre_tipo, descripcion, tasa_interes, plazo_maximo_meses, monto_minimo, monto_maximo, gastos_legales, porcentaje_mora, dias_gracia, requisitos, empresa_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    nombre_tipo,
                    descripcion,
                    tasa_interes,
                    plazo_maximo_meses,
                    monto_minimo,
                    monto_maximo,
                    gastos_legales,
                    porcentaje_mora,
                    dias_gracia,
                    requisitos,
                    empId
                ]);
                // Verificar si la inserción fue exitosa
                if (insertResult && insertResult.insertId) {
                    return {
                        ok: true,
                        msg: "Tipo de préstamo registrado correctamente",
                        status: 200,
                    };
                }
                else {
                    // Si no se pudo insertar el tipo de préstamo, devolver un error
                    return {
                        ok: false,
                        msg: "No se pudo registrar el tipo de préstamo",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    getLoanTypesByCompany(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Lógica para obtener todos los tipos de préstamos asociados a una empresa específica según el 'empresa_id'
                const loanTypes = yield (0, mysql_connector_1.execute)("SELECT * FROM tipos_prestamos WHERE empresa_id = ?", [
                    token.dataUsuario.emp_id.empresa_id,
                ]);
                if (loanTypes && loanTypes.length > 0) {
                    return {
                        ok: true,
                        data: loanTypes,
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se encontraron tipos de préstamos para esta empresa",
                        status: 404,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    updateLoanType(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo_prestamo_id, nombre_tipo, descripcion, tasa_interes, plazo_maximo_meses, monto_minimo, monto_maximo, gastos_legales, porcentaje_mora, dias_gracia, requisitos } = body;
                // Lógica para actualizar un tipo de préstamo existente en la base de datos
                const updateResult = yield (0, mysql_connector_1.execute)(`UPDATE tipos_prestamos 
         SET nombre_tipo = ?, descripcion = ?, tasa_interes = ?, plazo_maximo_meses = ?, 
             monto_minimo = ?, monto_maximo = ?, gastos_legales = ?, porcentaje_mora = ?, 
             dias_gracia = ?, requisitos = ?
         WHERE tipo_prestamo_id = ?`, [
                    nombre_tipo,
                    descripcion,
                    tasa_interes,
                    plazo_maximo_meses,
                    monto_minimo,
                    monto_maximo,
                    gastos_legales,
                    porcentaje_mora,
                    dias_gracia,
                    requisitos,
                    tipo_prestamo_id
                ]);
                // Verificar si la actualización fue exitosa
                if (updateResult && updateResult.affectedRows > 0) {
                    return {
                        ok: true,
                        msg: "Tipo de préstamo actualizado correctamente",
                        status: 200,
                    };
                }
                else {
                    // Si no se pudo actualizar el tipo de préstamo, devolver un error
                    return {
                        ok: false,
                        msg: "No se pudo actualizar el tipo de préstamo",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/registrar"),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Registro satisfactorio de tipo de préstamo", {
        ok: true,
        msg: "Tipo de préstamo registrado correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoanTypes.prototype, "registerLoanType", null);
__decorate([
    (0, tsoa_1.Get)("/por-empresa"),
    (0, tsoa_1.Response)(200, "Consulta satisfactoria de tipos de préstamos por empresa", {
        ok: true,
        data: [],
        status: 200,
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(404, "Not Found Items", {
        ok: false,
        msg: "No se encontraron tipos de préstamos para esta empresa",
        status: 404
    }),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanTypes.prototype, "getLoanTypesByCompany", null);
__decorate([
    (0, tsoa_1.Put)("/actualizar"),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Actualización satisfactoria del tipo de préstamo", {
        ok: true,
        msg: "Tipo de préstamo actualizado correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoanTypes.prototype, "updateLoanType", null);
LoanTypes = __decorate([
    (0, tsoa_1.Route)("/api/tipos-prestamos"),
    (0, tsoa_1.Tags)("Tipos de Préstamos")
], LoanTypes);
exports.default = LoanTypes;
