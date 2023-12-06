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
// pwd = bf063abe
let Empresas = class Empresas {
    registrarEmpresas(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre_completo, nombre_corto, rnc, website, persona, direccion, contactos, } = body;
                const existEmp = yield (0, mysql_connector_1.execute)(`SELECT nombre_completo, emp_id FROM empresas WHERE rnc = ${rnc}`);
                if (existEmp.length > 0) {
                    return {
                        message: "La empresa que desea registrar ya se encuentra en el sistema",
                        status: 400,
                        name: "ErrorExistEmp"
                    };
                }
                // registra la dirección de la persona
                const direccionResult = yield (0, mysql_connector_1.execute)('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
                    persona.direccion.provincia_id,
                    persona.direccion.municipio_id,
                    persona.direccion.direccion,
                    persona.direccion.codigo_postal,
                    persona.direccion.referencia,
                ]);
                const direccion_id = direccionResult.insertId;
                // Primero, registra la persona y obtén su persona_id generado
                const personaResult = yield (0, mysql_connector_1.execute)('INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    persona.persona.nombre,
                    persona.persona.segundo_nombre,
                    persona.persona.primer_apellido,
                    persona.persona.segundo_apellido,
                    persona.persona.fecha_nacimiento,
                    persona.persona.sexo,
                    persona.persona.estado,
                    direccion_id,
                    persona.persona.cedula
                ]);
                const persona_id = personaResult.insertId;
                // Registra los contactos de la persona
                for (const contacto of persona.contactos) {
                    yield (0, mysql_connector_1.execute)('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)', [
                        contacto.telefono,
                        contacto.movil,
                        contacto.telefono_oficina,
                        contacto.correo_electronico,
                        persona_id
                    ]);
                }
                const direccionEmpResult = yield (0, mysql_connector_1.execute)('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
                    direccion.provincia_id,
                    direccion.municipio_id,
                    direccion.direccion,
                    direccion.codigo_postal,
                    direccion.referencia,
                ]);
                const direccion_id_emp = direccionEmpResult.insertId;
                // Finalmente, registra la empresa
                const empresaResult = yield (0, mysql_connector_1.execute)('INSERT INTO empresas (nombre_completo, nombre_corto, rnc, website, direccion_id) VALUES (?, ?, ?, ?, ?)', [
                    nombre_completo,
                    nombre_corto,
                    rnc,
                    website,
                    direccion_id_emp,
                ]);
                const emp_id = empresaResult.insertId;
                for (const contacto of contactos) {
                    yield (0, mysql_connector_1.execute)('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, emp_id) VALUES (?, ?, ?, ?, ?)', [
                        contacto.telefono,
                        contacto.movil,
                        contacto.telefono_oficina,
                        contacto.correo_electronico,
                        emp_id
                    ]);
                }
                // Actualiza los contactos de la persona con el emp_id (empresa_id) real generado
                yield (0, mysql_connector_1.execute)('UPDATE contactos SET emp_id = ? WHERE persona_id = ?', [emp_id, persona_id]);
                const saltRounds = 10; // Número de rondas de sal (más rondas, más seguro pero más lento)
                // Generar el hash del password
                const raw_pwd = (0, helpers_1.generatePassword)();
                const hash_pwd = yield bcrypt_1.default.hash(raw_pwd, saltRounds);
                console.log('password generate --->', raw_pwd, hash_pwd);
                yield (0, mysql_connector_1.execute)('INSERT INTO users (username, pwd, persona_id, roll_id) VALUES (?, ?, ?, ?)', [
                    persona.persona.cedula,
                    hash_pwd,
                    persona_id,
                    1
                ]);
                yield (0, mysql_connector_1.execute)('INSERT INTO empleados (persona_id, cargo, salario, fecha_inicio_contrato, empresa_id) VALUES (?, ?, ?, ?, ?)', [
                    persona_id,
                    "Gerente/Administrador",
                    "0",
                    "2023-01-01",
                    emp_id
                ]);
                return {
                    msg: 'Empresa registrada exitosamente',
                    ok: true,
                    status: 200
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error inesperado del sistema, por favor contacte al administrador',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    consultarEmpresas(querys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, rnc } = querys;
                let query = `SELECT * FROM empresas
      WHERE 1 = 1`;
                if (rnc) {
                    query += ` AND rnc = ${rnc}`;
                }
                if (nombre) {
                    query += ` AND nombre_completo LIKE '%${nombre}%'`;
                }
                const findEmp = yield (0, mysql_connector_1.execute)(query);
                if (findEmp.length == 0)
                    return {
                        ok: false,
                        msg: "No se encontraron empresas con los parametros compartidos",
                        status: 404
                    };
                return {
                    ok: true,
                    data: findEmp,
                    status: 200
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error inesperado del sistema, por favor contacte al administrador',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    actualizarEmpresa(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, nombre_completo, nombre_corto, rnc, website, persona, direccion, contactos, } = body;
                // Actualiza los datos de la empresa
                yield (0, mysql_connector_1.execute)('UPDATE empresas SET nombre_completo = ?, nombre_corto = ?, rnc = ?, website = ? WHERE emp_id = ?', [
                    nombre_completo,
                    nombre_corto,
                    rnc,
                    website,
                    emp_id,
                ]);
                const direccionEmpResult = yield (0, mysql_connector_1.execute)('UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?', [
                    direccion.provincia_id,
                    direccion.municipio_id,
                    direccion.direccion,
                    direccion.codigo_postal,
                    direccion.referencia,
                    direccion.direccion_id
                ]);
                for (const contacto of contactos) {
                    yield (0, mysql_connector_1.execute)('UPDATE contactos SET telefono = ?, movil = ?, telefono_oficina = ?, correo_electronico = ?, emp_id = ? WHERE contacto_id = ?', [
                        contacto.telefono,
                        contacto.movil,
                        contacto.telefono_oficina,
                        contacto.correo_electronico,
                        emp_id,
                        contacto.contacto_id
                    ]);
                }
                // Obtiene el direccion_id actual de la persona
                const direccionPersonaResult = yield (0, mysql_connector_1.execute)('SELECT direccion_id FROM persona WHERE persona_id = ?', [persona.persona.persona_id]);
                const direccion_id_persona = direccionPersonaResult[0].direccion_id;
                // Actualiza la dirección de la persona
                yield (0, mysql_connector_1.execute)('UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?', [
                    persona.direccion.provincia_id,
                    persona.direccion.municipio_id,
                    persona.direccion.direccion,
                    persona.direccion.codigo_postal,
                    persona.direccion.referencia,
                    direccion_id_persona,
                ]);
                // Actualiza los datos de la persona
                yield (0, mysql_connector_1.execute)('UPDATE persona SET nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE persona_id = ?', [
                    persona.persona.nombre,
                    persona.persona.segundo_nombre,
                    persona.persona.primer_apellido,
                    persona.persona.segundo_apellido,
                    persona.persona.fecha_nacimiento,
                    persona.persona.sexo,
                    persona.persona.estado,
                    persona.persona.persona_id,
                ]);
                // Actualiza los contactos de la persona
                for (const contacto of persona.contactos) {
                    yield (0, mysql_connector_1.execute)('UPDATE contactos SET telefono = ?, movil = ?, telefono_oficina = ?, correo_electronico = ? WHERE contacto_id = ?', [
                        contacto.telefono,
                        contacto.movil,
                        contacto.telefono_oficina,
                        contacto.correo_electronico,
                        contacto.contacto_id,
                    ]);
                }
                return {
                    msg: 'Datos de la empresa actualizados exitosamente',
                    ok: true,
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error inesperado del sistema, por favor contacte al administrador',
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/registrar"),
    (0, tsoa_1.Response)(200, "Empresa registrada", {
        msg: "La empresa ha sido registrada corractamente",
        ok: true,
        status: 200
    }),
    (0, tsoa_1.Response)(400, "Empresa Existe", {
        message: "La empresa que desea registrar ya se encuentra en el sistema",
        status: 400,
        name: "ErrorExistEmp"
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
], Empresas.prototype, "registrarEmpresas", null);
__decorate([
    (0, tsoa_1.Get)("/all"),
    (0, tsoa_1.Response)(200, "Consulta de Empresas", {
        ok: true,
        data: {},
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500
    }),
    (0, tsoa_1.Response)(404, "No se encontraron empresas", {
        ok: false,
        msg: "No se encontraron empresas con los parametros compartidos",
        status: 404
    }),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Empresas.prototype, "consultarEmpresas", null);
__decorate([
    (0, tsoa_1.Put)('/actualizar'),
    (0, tsoa_1.Response)(200, "Consulta de Empresas", {
        ok: true,
        msg: "Empresa actualizada correctamente",
        status: 200
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500
    }),
    (0, tsoa_1.Response)(404, "No se encontro la empresa", {
        ok: false,
        msg: "No se encontro la empresa con los parametros compartidos",
        status: 404
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Empresas.prototype, "actualizarEmpresa", null);
Empresas = __decorate([
    (0, tsoa_1.Route)("api/empresas"),
    (0, tsoa_1.Tags)('Empresas')
], Empresas);
exports.default = Empresas;
