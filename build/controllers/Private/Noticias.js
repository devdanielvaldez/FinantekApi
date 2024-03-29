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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const mysql_connector_1 = require("../../api/utils/mysql.connector"); // Reemplaza esto con la forma en que realizas consultas a la base de datos
const helpers_1 = require("../../api/utils/helpers");
const moment_1 = __importDefault(require("moment"));
let NoticiasController = class NoticiasController {
    registrarNoticia(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, descripcion, fecha_vencimiento, } = body;
                const empId = token.dataUsuario.emp_id.empresa_id;
                // Realiza validaciones si es necesario
                // Inserta la noticia en la base de datos
                yield (0, mysql_connector_1.execute)('INSERT INTO noticias (empresa_id, titulo, descripcion, persona_id, fecha_publicacion, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)', [
                    empId,
                    titulo,
                    descripcion,
                    null,
                    (0, helpers_1.formatDate)((0, moment_1.default)(), 'n'),
                    fecha_vencimiento,
                ]);
                return {
                    ok: true,
                    msg: 'Noticia registrada exitosamente',
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
    getNoticiasByEmpresa(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const noticias = yield (0, mysql_connector_1.execute)(`SELECT * from noticias WHERE empresa_id = ?`, [
                    empId
                ]);
                const data = noticias.map((n) => ({
                    noticia_id: n.noticia_id,
                    titulo: n.titulo,
                    descripcion: n.descripcion,
                    fecha_publicacion: n.fecha_publicacion,
                    fecha_vencimiento: n.fecha_vencimiento,
                    fecha_creacion: n.fecha_creacion,
                    fecha_actualizacion: n.fecha_actualizacion,
                }));
                return {
                    ok: true,
                    data: data,
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
    updateNoticia(noticia_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, descripcion, fecha_vencimiento } = updateData;
                const updateQuery = `
                UPDATE noticias
                SET
                    titulo = ?,
                    descripcion = ?,
                    fecha_vencimiento = ?
                WHERE noticia_id = ?
            `;
                yield (0, mysql_connector_1.execute)(updateQuery, [titulo, descripcion, fecha_vencimiento, noticia_id]);
                return {
                    ok: true,
                    msg: 'Noticia actualizada exitosamente',
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
    deleteNoticia(noticia_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM noticias WHERE noticia_id = ?';
                yield (0, mysql_connector_1.execute)(deleteQuery, [noticia_id]);
                return {
                    ok: true,
                    msg: 'Noticia eliminada exitosamente',
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
    (0, tsoa_1.Response)(200, 'Noticia registrada', {
        ok: true,
        msg: 'Noticia registrada exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NoticiasController.prototype, "registrarNoticia", null);
__decorate([
    (0, tsoa_1.Get)('/empresa'),
    (0, tsoa_1.Response)(200, 'Noticias de la empresa', {
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
], NoticiasController.prototype, "getNoticiasByEmpresa", null);
__decorate([
    (0, tsoa_1.Put)('/update/{noticia_id}'),
    (0, tsoa_1.Response)(200, 'Noticia actualizada', {
        ok: true,
        msg: 'Noticia actualizada exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NoticiasController.prototype, "updateNoticia", null);
__decorate([
    (0, tsoa_1.Delete)('/delete/{noticia_id}'),
    (0, tsoa_1.Response)(200, 'Noticia eliminada', {
        ok: true,
        msg: 'Noticia eliminada exitosamente',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticiasController.prototype, "deleteNoticia", null);
NoticiasController = __decorate([
    (0, tsoa_1.Route)('api/noticias'),
    (0, tsoa_1.Tags)('Noticias')
], NoticiasController);
exports.default = NoticiasController;
