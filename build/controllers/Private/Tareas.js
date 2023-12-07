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
let TareasController = class TareasController {
    crearTarea(tareaData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { empleado_id, descripcion, fecha, prioridad } = tareaData;
                const userId = token.dataUsuario.user;
                const insertQuery = `
                INSERT INTO tareas (empleado_id, supervisor_id, descripcion, fecha, prioridad, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
                yield (0, mysql_connector_1.execute)(insertQuery, [empleado_id, userId, descripcion, fecha, prioridad, 'pe']);
                return {
                    ok: true,
                    msg: 'Tarea creada exitosamente',
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
    actualizarTarea(tarea_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { descripcion, fecha, prioridad, estado } = updateData;
                const updateQuery = `
                UPDATE tareas
                SET
                    descripcion = ?,
                    fecha = ?,
                    prioridad = ?,
                    estado = ?
                WHERE tarea_id = ?
            `;
                yield (0, mysql_connector_1.execute)(updateQuery, [descripcion, fecha, prioridad, estado, tarea_id]);
                return {
                    ok: true,
                    msg: 'Tarea actualizada exitosamente',
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
    eliminarTarea(tarea_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM tareas WHERE tarea_id = ?';
                yield (0, mysql_connector_1.execute)(deleteQuery, [tarea_id]);
                return {
                    ok: true,
                    msg: 'Tarea eliminada exitosamente',
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
    obtenerMisTareas(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = token.dataUsuario.user;
                const query = `
                SELECT t.*, e1.*, e2.*
                FROM tareas t
                LEFT JOIN empleados e1 ON t.empleado_id = e1.empleado_id
                LEFT JOIN empleados e2 ON t.supervisor_id = e2.empleado_id
                WHERE t.empleado_id = ? OR t.supervisor_id = ?
            `;
                const result = yield (0, mysql_connector_1.execute)(query, [user, user]);
                const tareas = result.map((row) => {
                    return {
                        tarea_id: row.tarea_id,
                        descripcion: row.descripcion,
                        fecha: row.fecha,
                        prioridad: row.prioridad,
                        estado: row.estado,
                        empleado: {
                            empleado_id: row.empleado_id,
                            // Otros campos del empleado
                        },
                        supervisor: {
                            empleado_id: row.supervisor_id,
                            // Otros campos del supervisor
                        },
                    };
                });
                return {
                    ok: true,
                    data: tareas,
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
    (0, tsoa_1.Post)('/crear'),
    (0, tsoa_1.Response)(200, 'Tarea creada', {
        ok: true,
        msg: 'Tarea creada exitosamente',
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
], TareasController.prototype, "crearTarea", null);
__decorate([
    (0, tsoa_1.Put)('/update/{tarea_id}')
    // Decoradores @Response y otros detalles similares
    ,
    (0, tsoa_1.Response)(200, 'Tarea Actualizada', {
        ok: true,
        msg: 'Tarea actualizada exitosamente',
        status: 200
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
], TareasController.prototype, "actualizarTarea", null);
__decorate([
    (0, tsoa_1.Delete)('/delete/{tarea_id}')
    // Decoradores @Response y otros detalles similares
    ,
    (0, tsoa_1.Response)(200, 'Tarea Eliminada', {
        ok: true,
        msg: 'Tarea Eliminada exitosamente',
        status: 200
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
], TareasController.prototype, "eliminarTarea", null);
__decorate([
    (0, tsoa_1.Get)('/mis-tareas'),
    (0, tsoa_1.Response)(200, 'Tareas obtenidas', {
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
], TareasController.prototype, "obtenerMisTareas", null);
TareasController = __decorate([
    (0, tsoa_1.Route)('api/tareas'),
    (0, tsoa_1.Tags)('Tareas')
], TareasController);
exports.default = TareasController;
