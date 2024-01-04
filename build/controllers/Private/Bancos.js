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
                const { catalogo_id, telefono } = bancoData;
                const existBank = yield (0, mysql_connector_1.execute)('SELECT catalog_bank_id FROM bancos WHERE catalog_bank_id = ?', [
                    catalogo_id
                ]);
                if (existBank.length > 0)
                    return {
                        ok: false,
                        msg: "El banco que desea ingresar ya existe en el sistema"
                    };
                const insertQuery = `
                INSERT INTO bancos (catalog_bank_id, telefono, emp_id, estado)
                VALUES (?, ?, ?, ?)
            `;
                yield (0, mysql_connector_1.execute)(insertQuery, [catalogo_id, telefono, token.dataUsuario.emp_id.empresa_id, 'a']);
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
                const query = `SELECT b.banco_id, b.telefono, b.emp_id, b.estado, cb.CodigoBanco, cb.NombreBanco, cb.Bank_id
            FROM bancos b
            LEFT JOIN CatalogoBancos cb ON b.catalog_bank_id = cb.Bank_id
            WHERE emp_id = ?`;
                const empId = token.dataUsuario.emp_id.empresa_id;
                const result = yield (0, mysql_connector_1.execute)(query, [empId]);
                const bancos = result;
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
                const query = `SELECT b.banco_id, b.telefono, b.emp_id, b.estado, cb.CodigoBanco, cb.NombreBanco
        FROM bancos b
        LEFT JOIN CatalogoBancos cb ON b.catalog_bank_id = cb.ID
        WHERE banco_id = ?`;
                const result = yield (0, mysql_connector_1.execute)(query, [banco_id]);
                if (result.length === 0) {
                    return {
                        ok: false,
                        msg: 'Banco no encontrado',
                        status: 404,
                    };
                }
                const banco = result;
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
                const { catalogo_id, telefono } = updateData;
                const updateQuery = `
            UPDATE bancos
            SET
                catalog_bank_id = ?,
                telefono = ?
            WHERE banco_id = ?
        `;
                yield (0, mysql_connector_1.execute)(updateQuery, [catalogo_id, telefono, banco_id]);
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
    getBanksCatalog(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM CatalogoBancos`;
                const result = yield (0, mysql_connector_1.execute)(query);
                const bancos = result.map((row) => {
                    return {
                        bank_id: row.Bank_id,
                        codigo: row.CodigoBanco,
                        nombre: row.NombreBanco
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
__decorate([
    (0, tsoa_1.Get)('/catalogo/bancos'),
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
], BancosController.prototype, "getBanksCatalog", null);
BancosController = __decorate([
    (0, tsoa_1.Route)('api/bancos'),
    (0, tsoa_1.Tags)('Bancos')
], BancosController);
exports.default = BancosController;
