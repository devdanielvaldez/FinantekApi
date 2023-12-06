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
let LoanRequests = class LoanRequests {
    createLoanRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cliente_id, tipo_prestamo_id, empresa_id, monto_solicitado, emp_id, documentos // Lista de documentos
                 } = body;
                // Al crear la solicitud, el estado automáticamente queda como "PE" (pendiente)
                const insertResult = yield (0, mysql_connector_1.execute)(`INSERT INTO solicitudes_prestamo 
        (cliente_id, tipo_prestamo_id, empresa_id, monto_solicitado, estado_solicitud, emp_id) 
        VALUES (?, ?, ?, ?, 'PE', ?)`, [
                    cliente_id,
                    tipo_prestamo_id,
                    empresa_id,
                    monto_solicitado,
                    emp_id
                ]);
                // Verificar si la inserción fue exitosa
                if (insertResult && insertResult.insertId) {
                    // Obtener el ID de la solicitud recién creada
                    const solicitudId = insertResult.insertId;
                    // Insertar los documentos asociados a la solicitud en la tabla de documentos
                    for (const documento of documentos) {
                        yield (0, mysql_connector_1.execute)(`INSERT INTO documentos_solicitud 
            (solicitud_id, nombre, enlace) 
            VALUES (?, ?, ?)`, [
                            solicitudId,
                            documento.nombre,
                            documento.enlace
                        ]);
                    }
                    return {
                        ok: true,
                        msg: "Solicitud de préstamo creada correctamente",
                        status: 200,
                    };
                }
                else {
                    // Si no se pudo crear la solicitud, devolver un error
                    return {
                        ok: false,
                        msg: "No se pudo crear la solicitud de préstamo",
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
    getAllLoanRequestsByCompany(empresa_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loanRequests = yield (0, mysql_connector_1.execute)(`SELECT * FROM solicitudes_prestamo WHERE empresa_id = ?`, [empresa_id]);
                return loanRequests;
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener las solicitudes por empresa",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    getLoanRequestByIdAndCompany(empresa_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loanRequest = yield (0, mysql_connector_1.execute)(`SELECT * FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`, [id, empresa_id]);
                return loanRequest;
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener la solicitud por empresa",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    updateLoanRequest(empresa_id, id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cliente_id, tipo_prestamo_id, monto_solicitado, emp_id } = updatedData;
                const updateResult = yield (0, mysql_connector_1.execute)(`UPDATE solicitudes_prestamo 
      SET cliente_id = ?, tipo_prestamo_id = ?, monto_solicitado = ?, emp_id = ? 
      WHERE solicitud_id = ? AND empresa_id = ?`, [cliente_id, tipo_prestamo_id, monto_solicitado, emp_id, id, empresa_id]);
                if (updateResult.affectedRows > 0) {
                    return {
                        ok: true,
                        msg: "Solicitud de préstamo actualizada correctamente",
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se pudo actualizar la solicitud de préstamo o la solicitud no existe para esa empresa",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al actualizar la solicitud por empresa",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    deleteLoanRequest(empresa_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteResult = yield (0, mysql_connector_1.execute)(`DELETE FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`, [id, empresa_id]);
                if (deleteResult.affectedRows > 0) {
                    return {
                        ok: true,
                        msg: "Solicitud de préstamo eliminada correctamente",
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se pudo eliminar la solicitud de préstamo o la solicitud no existe para esa empresa",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al eliminar la solicitud por empresa",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    updateLoanRequestStatus(empresa_id, solicitud_id, newStatusData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nuevo_estado, mensaje, empleado_id } = newStatusData;
                // Obtener el estado actual de la solicitud
                const currentStatusQuery = yield (0, mysql_connector_1.execute)(`SELECT estado_solicitud FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`, [solicitud_id, empresa_id]);
                if (!currentStatusQuery || currentStatusQuery.length === 0) {
                    return {
                        ok: false,
                        msg: "No se encontró la solicitud de préstamo para esa empresa",
                        status: 404,
                    };
                }
                const estado_anterior = currentStatusQuery[0].estado_solicitud;
                // Actualizar el estado de la solicitud
                const updateResult = yield (0, mysql_connector_1.execute)(`UPDATE solicitudes_prestamo 
      SET estado_solicitud = ? 
      WHERE solicitud_id = ? AND empresa_id = ?`, [nuevo_estado, solicitud_id, empresa_id]);
                if (updateResult.affectedRows > 0) {
                    // Registrar el cambio en la tabla mensajes_estado_solicitud
                    yield (0, mysql_connector_1.execute)(`INSERT INTO mensajes_estado_solicitud 
        (solicitud_id, estado_anterior, estado_nuevo, mensaje, empleado_id) 
        VALUES (?, ?, ?, ?, ?)`, [solicitud_id, estado_anterior, nuevo_estado, mensaje, empleado_id]);
                    return {
                        ok: true,
                        msg: "Estado de la solicitud de préstamo actualizado correctamente",
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se pudo actualizar el estado de la solicitud de préstamo",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al actualizar el estado de la solicitud",
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
    (0, tsoa_1.Response)(200, "Creación satisfactoria de solicitud de préstamo", {
        ok: true,
        msg: "Solicitud de préstamo creada correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "createLoanRequest", null);
__decorate([
    (0, tsoa_1.Get)("/solicitudes/:empresa_id"),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Success", {
        ok: true,
        data: [],
        status: 200
    }),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "getAllLoanRequestsByCompany", null);
__decorate([
    (0, tsoa_1.Get)("/solicitudes/:empresa_id/:id"),
    (0, tsoa_1.Response)(200, "Success", {
        ok: true,
        data: {},
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "getLoanRequestByIdAndCompany", null);
__decorate([
    (0, tsoa_1.Put)("/solicitudes/:empresa_id/:id/editar"),
    (0, tsoa_1.Response)(200, "Success", {
        ok: true,
        data: {},
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "updateLoanRequest", null);
__decorate([
    (0, tsoa_1.Delete)("/solicitudes/:empresa_id/:id/eliminar"),
    (0, tsoa_1.Response)(200, "Success", {
        ok: true,
        data: {},
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "deleteLoanRequest", null);
__decorate([
    (0, tsoa_1.Put)("/solicitudes/:empresa_id/:solicitud_id/actualizar-estado"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], LoanRequests.prototype, "updateLoanRequestStatus", null);
LoanRequests = __decorate([
    (0, tsoa_1.Route)("/api/solicitudes-prestamo"),
    (0, tsoa_1.Tags)("Solicitudes de Préstamo")
], LoanRequests);
exports.default = LoanRequests;