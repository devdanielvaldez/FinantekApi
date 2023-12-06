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
const mysql_connector_1 = require("../../api/utils/mysql.connector");
const helpers_1 = require("../../api/utils/helpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
// pws = 22cd813e
let Empleados = class Empleados {
    registrarEmpleado(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { persona, empleado, contactos, direccion, rol } = body;
            try {
                // Registrar la dirección
                const direccionInsert = yield (0, mysql_connector_1.execute)('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
                    direccion.provincia_id,
                    direccion.municipio_id,
                    direccion.direccion,
                    direccion.codigo_postal,
                    direccion.referencia
                ]);
                const direccionId = direccionInsert.insertId;
                // Registrar la persona
                const personaInsert = yield (0, mysql_connector_1.execute)('INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    persona.nombre,
                    persona.segundo_nombre,
                    persona.primer_apellido,
                    persona.segundo_apellido,
                    persona.fecha_nacimiento,
                    persona.sexo,
                    persona.estado,
                    direccionId,
                    persona.cedula
                ]);
                const personaId = personaInsert.insertId;
                // Registrar el empleado asociado a la persona
                const empleadoInsert = yield (0, mysql_connector_1.execute)('INSERT INTO empleados (persona_id, cargo, salario, fecha_inicio_contrato, empresa_id) VALUES (?, ?, ?, ?, ?)', [
                    personaId,
                    empleado.cargo,
                    empleado.salario,
                    empleado.fecha_inicio_contrato,
                    empleado.empresa_id
                ]);
                const empleadoId = empleadoInsert.insertId;
                // Registrar los contactos de la persona
                for (const c of contactos) {
                    yield (0, mysql_connector_1.execute)('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)', [
                        c.telefono,
                        c.movil,
                        c.telefono_oficina,
                        c.correo_electronico,
                        personaId
                    ]);
                }
                const raw_pwd = (0, helpers_1.generatePassword)();
                const hash_pwd = yield bcrypt_1.default.hash(raw_pwd, 10);
                console.log('password generate --->', raw_pwd, hash_pwd);
                yield (0, mysql_connector_1.execute)('INSERT INTO users (username, pwd, persona_id, roll_id) VALUES (?, ?, ?, ?)', [
                    persona.cedula,
                    hash_pwd,
                    personaId,
                    rol
                ]);
                return {
                    ok: true,
                    msg: "Empleado registrado correctamente",
                    status: 200
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500
                };
            }
        });
    }
    getAllEmployeesByQuery(emp_id, nombre, apellido, cargo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `
            SELECT
                e.empleado_id,
                e.cargo,
                e.salario,
                e.fecha_inicio_contrato,
                e.supervisor_id,
                e.estado,
                p.persona_id,
                p.nombre,
                p.segundo_nombre,
                p.primer_apellido,
                p.segundo_apellido,
                p.fecha_nacimiento,
                p.sexo,
                p.estado
            FROM empleados e
            JOIN persona p ON e.persona_id = p.persona_id
            WHERE empresa_id = ?`;
                const empId = emp_id; // Obtén el emp_id de la empresa de alguna manera
                const conditions = [];
                if (nombre) {
                    conditions.push(`p.nombre LIKE '%${nombre}%'`);
                }
                if (apellido) {
                    conditions.push(`p.primer_apellido LIKE '%${apellido}%'`);
                }
                if (cargo) {
                    conditions.push(`e.cargo LIKE '%${cargo}%'`);
                }
                if (conditions.length > 0) {
                    query += ` AND ${conditions.join(' AND ')}`;
                }
                const findEmployees = yield (0, mysql_connector_1.execute)(query, [empId]);
                const data = findEmployees.map((p) => ({
                    empleado_id: p.empleado_id,
                    cargo: p.cargo,
                    salario: p.salario,
                    fecha_inicio_contrato: p.fecha_inicio_contrato,
                    supervisor_id: p.supervisor_id,
                    estado: p.estado,
                    persona: {
                        persona_id: p.persona_id,
                        nombre: p.nombre,
                        segundo_nombre: p.segundo_nombre,
                        primer_apellido: p.primer_apellido,
                        segundo_apellido: p.segundo_apellido,
                        fecha_nacimiento: p.fecha_nacimiento,
                        sexo: p.sexo,
                        estado: p.estado
                    }
                }));
                return {
                    ok: true,
                    data: data,
                    status: 200
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500
                };
            }
        });
    }
    updateEmployee(empleadoId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cargo, salario, supervisor_id, estado } = updateData;
                // Verificar si el empleado existe
                const existEmployee = yield (0, mysql_connector_1.execute)('SELECT empleado_id FROM empleados WHERE empleado_id = ?', [empleadoId]);
                if (existEmployee.length === 0) {
                    return {
                        ok: false,
                        msg: "No se encontró el empleado con el ID proporcionado",
                        status: 404
                    };
                }
                const updateQuery = `
            UPDATE empleados
            SET
                cargo = ?,
                salario = ?,
                supervisor_id = ?,
                estado = ?
            WHERE empleado_id = ?
        `;
                yield (0, mysql_connector_1.execute)(updateQuery, [cargo, salario, supervisor_id, estado, empleadoId]);
                return {
                    ok: true,
                    msg: "Empleado actualizado exitosamente",
                    status: 200
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err,
                    status: 500
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)('/registrar'),
    (0, tsoa_1.Response)(200, "Empleado registrado", {
        msg: "El empleado ha sido registrado correctamente",
        ok: true,
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Empleados.prototype, "registrarEmpleado", null);
__decorate([
    (0, tsoa_1.Get)('/search'),
    (0, tsoa_1.Response)(200, "Buscar empleados", {
        ok: true,
        status: 200,
        data: []
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500
    }),
    __param(0, (0, tsoa_1.Query)('emp_id')),
    __param(1, (0, tsoa_1.Query)('nombre')),
    __param(2, (0, tsoa_1.Query)('apellido')),
    __param(3, (0, tsoa_1.Query)('cargo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], Empleados.prototype, "getAllEmployeesByQuery", null);
__decorate([
    (0, tsoa_1.Put)('/update/{empleadoId}'),
    (0, tsoa_1.Response)(200, "Empleado actualizado", {
        ok: true,
        msg: "Empleado actualizado exitosamente",
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500
    }),
    (0, tsoa_1.Response)(404, "No se encontró el empleado", {
        ok: false,
        msg: "No se encontró el empleado con el ID proporcionado",
        status: 404
    }),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], Empleados.prototype, "updateEmployee", null);
Empleados = __decorate([
    (0, tsoa_1.Route)('api/empleados'),
    (0, tsoa_1.Tags)('Empleados')
], Empleados);
exports.default = Empleados;