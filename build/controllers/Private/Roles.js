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
const tsoa_1 = require("tsoa"); // Importa tus decoradores
const mysql_connector_1 = require("../../api/utils/mysql.connector");
let RolController = class RolController {
    registrarRol(rolData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, pantallasAsociadas, horarioInicio, horarioFin } = rolData;
                console.log(rolData);
                // Paso 1: Crear un nuevo rol
                const insertRolQuery = `INSERT INTO roles (nombre) VALUES (?)`;
                const result = yield (0, mysql_connector_1.execute)(insertRolQuery, [nombre]);
                const nuevoRolId = result.insertId;
                // Paso 2: Asociar pantallas al nuevo rol
                const insertPantallasQuery = `INSERT INTO acceso_rol_pantalla (rol_id, pantalla_id) VALUES (?, ?)`;
                const pantallasValores = [];
                console.log(pantallasAsociadas);
                for (let i = 0; i < pantallasAsociadas.length; i++) {
                    const pantallaId = pantallasAsociadas[i];
                    yield (0, mysql_connector_1.execute)(insertPantallasQuery, [nuevoRolId, pantallasAsociadas[i]]);
                }
                // Paso 3: Agregar horario de acceso para el nuevo rol
                const insertHorarioQuery = `INSERT INTO horario_acceso_rol (rol_id, horario_inicio, horario_fin) VALUES (?, ?, ?)`;
                yield (0, mysql_connector_1.execute)(insertHorarioQuery, [
                    nuevoRolId,
                    horarioInicio,
                    horarioFin,
                ]);
                return {
                    ok: true,
                    msg: "Rol registrado exitosamente",
                    status: 200,
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    getPantallas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "SELECT * FROM pantallas";
                const findPantallas = yield (0, mysql_connector_1.execute)(query);
                return {
                    ok: true,
                    data: findPantallas,
                    status: 200,
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    status: 500,
                    err: err,
                };
            }
        });
    }
    RolUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT arp.*, pa.*
      FROM users u
      JOIN empleados e ON u.empleado_id = e.empleado_id
      JOIN roles r ON e.rol = r.rol_id
      JOIN acceso_rol_pantalla arp ON r.rol_id = arp.rol_id
      JOIN pantallas pa ON arp.pantalla_id = pa.pantalla_id
      WHERE u.user_id = ?`;
                const findEUserRol = yield (0, mysql_connector_1.execute)(query, [+token.dataUsuario.user]);
                return {
                    ok: true,
                    status: 200,
                    data: findEUserRol
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener la lista de roles",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    obtenerRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
      SELECT r.*, 
      GROUP_CONCAT(p_pantallas.nombre) AS pantallas_asociadas,
      h.horario_inicio,
      h.horario_fin
FROM roles r
LEFT JOIN acceso_rol_pantalla p ON r.rol_id = p.rol_id
LEFT JOIN horario_acceso_rol h ON r.rol_id = h.rol_id
LEFT JOIN pantallas p_pantallas ON p.pantalla_id = p_pantallas.pantalla_id
GROUP BY r.rol_id, h.horario_inicio, h.horario_fin
    `;
                const roles = yield (0, mysql_connector_1.execute)(query);
                return {
                    ok: true,
                    status: 200,
                    data: roles,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener la lista de roles",
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/registrar"),
    (0, tsoa_1.Response)(200, "Rol registrado", {
        ok: true,
        msg: "Rol registrado exitosamente",
        status: 200,
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(400, "Error al registrar el rol", {
        ok: false,
        msg: "Error al registrar el rol",
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolController.prototype, "registrarRol", null);
__decorate([
    (0, tsoa_1.Get)("/pantallas"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolController.prototype, "getPantallas", null);
__decorate([
    (0, tsoa_1.Get)('/rol/user'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolController.prototype, "RolUser", null);
__decorate([
    (0, tsoa_1.Get)("/roles"),
    (0, tsoa_1.Response)(200, "Lista de roles obtenida", {
        ok: true,
        msg: "Lista de roles obtenida exitosamente",
        status: 200,
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema al obtener la lista de roles",
        error: {},
        status: 500,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolController.prototype, "obtenerRoles", null);
RolController = __decorate([
    (0, tsoa_1.Route)("/api/roles"),
    (0, tsoa_1.Tags)("Roles")
], RolController);
exports.default = RolController;
