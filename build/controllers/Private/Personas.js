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
let Persona = class Persona {
    registrarPersona(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { persona, contactos, direccion } = body;
                const direccionInsert = yield (0, mysql_connector_1.execute)("INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)", [
                    direccion.provincia_id,
                    direccion.municipio_id,
                    direccion.direccion,
                    direccion.codigo_postal,
                    direccion.referencia,
                ]);
                const personaInsert = yield (0, mysql_connector_1.execute)("INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                    persona.nombre,
                    persona.segundo_nombre,
                    persona.primer_apellido,
                    persona.segundo_apellido,
                    persona.fecha_nacimiento,
                    persona.sexo,
                    'a',
                    direccionInsert.insertId,
                    persona.cedula,
                ]);
                for (const c of contactos) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)", [
                        c.telefono,
                        c.movil,
                        c.telefono_oficina,
                        c.correo_electronico,
                        personaInsert.insertId,
                    ]);
                }
                return {
                    ok: true,
                    msg: "Persona registrada correctamente",
                    status: 200,
                    persona_id: personaInsert.insertId
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error inesperado del sistema, por favor contacte al administrador",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    actualizarPersonaExistente(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, mysql_connector_1.execute)("UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?", [
                    body.direccion.provincia_id,
                    body.direccion.municipio_id,
                    body.direccion.direccion,
                    body.direccion.codigo_postal,
                    body.direccion.referencia,
                    body.personaId,
                ]);
                yield (0, mysql_connector_1.execute)("UPDATE persona SET nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE persona_id = ?", [
                    body.persona.nombre,
                    body.persona.segundo_nombre,
                    body.persona.primer_apellido,
                    body.persona.segundo_apellido,
                    body.persona.fecha_nacimiento,
                    body.persona.sexo,
                    body.persona.estado,
                    body.personaId,
                ]);
                yield (0, mysql_connector_1.execute)("DELETE FROM contactos WHERE persona_id = ?", [body.personaId]);
                for (const c of body.contactos) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)", [
                        c.telefono,
                        c.movil,
                        c.telefono_oficina,
                        c.correo_electronico,
                        body.personaId,
                    ]);
                }
                return {
                    ok: true,
                    msg: "Persona actualizada correctamente",
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
    getPersonas(querys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, cedula } = querys;
                let query = `SELECT 
            * FROM persona WHERE 1 = 1;`;
                if (cedula) {
                    query += ` AND cedula = ${cedula}`;
                }
                if (nombre) {
                    query += ` AND nombre LIKE '%${nombre}%'`;
                }
                const findPer = yield (0, mysql_connector_1.execute)(query);
                if (findPer.length == 0)
                    return {
                        ok: false,
                        msg: "No se encontraron personas con los parametros compartidos",
                        status: 404,
                    };
                let data = [];
                for (const p of findPer) {
                    yield data.push({
                        persona_id: p.persona_id,
                        nombre: p.nombre,
                        segundo_nombre: p.segundo_nombre,
                        primer_apellido: p.primer_apellido,
                        segundo_apellido: p.segundo_apellido,
                        fecha_nacimiento: p.fecha_nacimiento,
                        sexo: p.sexo,
                        estado: p.estado,
                        cedula: p.cedula,
                    });
                }
                return {
                    ok: true,
                    data: data,
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
    getPersonaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT 
            p.persona_id,
            p.nombre,
            p.segundo_nombre,
            p.primer_apellido,
            p.segundo_apellido,
            p.fecha_nacimiento,
            p.sexo,
            p.estado,
            d.direccion_id,
            d.provincia_id,
            d.municipio_id,
            d.direccion,
            d.codigo_postal,
            d.referencia,
            c.contacto_id,
            c.telefono,
            c.movil,
            c.telefono_oficina,
            c.correo_electronico
            FROM persona p
            LEFT JOIN direcciones d ON p.direccion_id = d.direccion_id
            LEFT JOIN contactos c ON p.persona_id = c.persona_id WHERE p.persona_id = ${id};`;
                const existPers = yield (0, mysql_connector_1.execute)(query);
                if (existPers.length == 0)
                    return {
                        ok: false,
                        msg: "No se encontro la persona con los parametros compartidos",
                        status: 404,
                    };
                let data = {
                    persona_id: existPers[0].persona_id,
                    nombre: existPers[0].nombre,
                    segundo_nombre: existPers[0].segundo_nombre,
                    primer_apellido: existPers[0].primer_apellido,
                    segundo_apellido: existPers[0].segundo_apellido,
                    fecha_nacimiento: existPers[0].fecha_nacimiento,
                    sexo: existPers[0].sexo,
                    estado: existPers[0].estado,
                    contacto: [],
                    direccion: {
                        direccion_id: existPers[0].direccion_id,
                        provincia_id: existPers[0].provincia_id,
                        municipio_id: existPers[0].municipio_id,
                        direccion: existPers[0].direccion,
                        codigo_postal: existPers[0].codigo_postal,
                        referencia: existPers[0].referencia,
                    },
                };
                for (const c of existPers) {
                    data.contacto.push({
                        contacto_id: c.contacto_id,
                        telefono: c.telefono,
                        movil: c.movil,
                        telefono_oficina: c.telefono_oficina,
                        correo_electronico: c.correo_electronico,
                    });
                }
                return {
                    ok: true,
                    data: data,
                    status: 200,
                };
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
    getPeopleByDNI(querys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cedula } = querys;
                if (cedula == "" || cedula == null || cedula == undefined) {
                    return {
                        ok: true,
                        data: [],
                        status: 200,
                    };
                }
                let query = `SELECT * FROM persona WHERE 1 = 1`;
                query += ` AND cedula LIKE '%${cedula}%'`;
                const findPer = yield (0, mysql_connector_1.execute)(query);
                if (findPer.length == 0)
                    return {
                        ok: false,
                        msg: "No se encontraron personas con los parametros compartidos",
                        status: 404,
                    };
                return {
                    ok: true,
                    data: findPer,
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
};
__decorate([
    (0, tsoa_1.Post)("/registrar"),
    (0, tsoa_1.Response)(200, "Persona registrada", {
        msg: "La persona ha sido registrada correctamente",
        ok: true,
        status: 200,
        persona_id: 0
    }),
    (0, tsoa_1.Response)(400, "Persona Existe", {
        message: "La persona que desea registrar ya se encuentra en el sistema",
        status: 400,
        name: "ErrorExistPer",
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Persona.prototype, "registrarPersona", null);
__decorate([
    (0, tsoa_1.Post)("/actualizar"),
    (0, tsoa_1.Response)(200, "Persona registrada", {
        msg: "La persona ha sido registrada correctamente",
        ok: true,
        status: 200,
        persona_id: 0
    }),
    (0, tsoa_1.Response)(400, "Persona no Existe", {
        message: "La persona que desea registrar no se encuentra en el sistema",
        status: 400,
        name: "ErrorExistPer",
    }),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Persona.prototype, "actualizarPersonaExistente", null);
__decorate([
    (0, tsoa_1.Get)("/all"),
    (0, tsoa_1.Response)(200, "Consulta de personas satisfactoria", {
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
    (0, tsoa_1.Response)(404, "No se encontraron personas", {
        ok: false,
        msg: "No se encontraron personas con los parametros compartidos",
        status: 404,
    }),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Persona.prototype, "getPersonas", null);
__decorate([
    (0, tsoa_1.Get)("/persona-por-id/{id}"),
    (0, tsoa_1.Response)(200, "Consulta de persona satisfactoria", {
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
    (0, tsoa_1.Response)(404, "No se encontro la persona", {
        ok: false,
        msg: "No se encontro la persona con los parametros compartidos",
        status: 404,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], Persona.prototype, "getPersonaById", null);
__decorate([
    (0, tsoa_1.Get)("/dni"),
    (0, tsoa_1.Response)(200, "Consulta de personas satisfactoria", {
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
    (0, tsoa_1.Response)(404, "No se encontraron personas", {
        ok: false,
        msg: "No se encontraron personas con los parametros compartidos",
        status: 404,
    }),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Persona.prototype, "getPeopleByDNI", null);
Persona = __decorate([
    (0, tsoa_1.Route)("api/personas"),
    (0, tsoa_1.Tags)("Personas")
], Persona);
exports.default = Persona;
