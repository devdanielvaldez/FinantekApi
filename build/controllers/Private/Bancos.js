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
const mysql_connector_1 = require("../../api/utils/mysql.connector"); // Reemplaza esto con la forma en que realizas consultas a la base de datos
let BancosController = class BancosController {
    registrarBanco(bancoData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, telefono, codigo } = bancoData;
                const existBank = yield (0, mysql_connector_1.execute)('SELECT nombre, codigo FROM bancos WHERE codigo = ?', [
                    codigo
                ]);
                if (existBank.length > 0)
                    return {
                        ok: false,
                        msg: "El banco que desea ingresar ya existe en el sistema"
                    };
                const insertQuery = `
                INSERT INTO bancos (nombre, telefono, codigo, emp_id, estado)
                VALUES (?, ?, ?, ?, ?)
            `;
                yield (0, mysql_connector_1.execute)(insertQuery, [nombre, telefono, codigo, token.dataUsuario.emp_id.empresa_id, 'a']);
                return {
                    ok: true,
                    msg: 'Banco registrado exitosamente',
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    verTodosLosBancos(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM bancos WHERE emp_id = ?`;
                const empId = token.dataUsuario.emp_id.empresa_id;
                const result = yield (0, mysql_connector_1.execute)(query, [empId]);
                const bancos = result.map((row) => {
                    return {
                        banco_id: row.banco_id,
                        nombre: row.nombre,
                        telefono: row.telefono,
                        codigo: row.codigo,
                        estado: row.estado
                    };
                });
                return {
                    ok: true,
                    data: bancos,
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    verBanco(banco_id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM bancos WHERE banco_id = ?`;
                const result = yield (0, mysql_connector_1.execute)(query, [banco_id]);
                if (result.length === 0) {
                    return {
                        ok: false,
                        msg: 'Banco no encontrado',
                        status: 404,
                    };
                }
                const banco = {
                    banco_id: result[0].banco_id,
                    nombre: result[0].nombre,
                    telefono: result[0].telefono,
                    codigo: result[0].codigo,
                };
                return {
                    ok: true,
                    data: banco,
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    actualizarBanco(banco_id, updateData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, telefono, codigo, estado } = updateData;
                const updateQuery = `
            UPDATE bancos
            SET
                nombre = ?,
                telefono = ?,
                codigo = ?,
                estado = ?
            WHERE banco_id = ?
        `;
                yield (0, mysql_connector_1.execute)(updateQuery, [nombre, telefono, codigo, estado, banco_id]);
                return {
                    ok: true,
                    msg: 'Banco actualizado exitosamente',
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    eliminarBanco(banco_id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM bancos WHERE banco_id = ?';
                yield (0, mysql_connector_1.execute)(deleteQuery, [banco_id]);
                return {
                    ok: true,
                    msg: 'Banco eliminado exitosamente',
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)('/registrar'),
    (0, tsoa_1.Response)(200, 'Banco registrado', {
        ok: true,
        msg: 'Banco registrado exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(400, "Banco Existe", {
        ok: false,
        msg: "El banco que desea ingresar ya existe en el sistema."
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "registrarBanco", null);
__decorate([
    (0, tsoa_1.Get)('/ver-todos'),
    (0, tsoa_1.Response)(200, 'Bancos obtenidos', {
        ok: true,
        data: [],
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "verTodosLosBancos", null);
__decorate([
    (0, tsoa_1.Get)('/ver/{banco_id}'),
    (0, tsoa_1.Response)(200, 'Banco obtenido', {
        ok: true,
        data: null,
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "verBanco", null);
__decorate([
    (0, tsoa_1.Put)('/actualizar/{banco_id}'),
    (0, tsoa_1.Response)(200, 'Banco actualizado', {
        ok: true,
        msg: 'Banco actualizado exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "actualizarBanco", null);
__decorate([
    (0, tsoa_1.Delete)('/eliminar/{banco_id}'),
    (0, tsoa_1.Response)(200, 'Banco eliminado', {
        ok: true,
        msg: 'Banco eliminado exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "eliminarBanco", null);
BancosController = __decorate([
    (0, tsoa_1.Route)('api/bancos'),
    (0, tsoa_1.Tags)('Bancos')
], BancosController);
exports.default = BancosController;
