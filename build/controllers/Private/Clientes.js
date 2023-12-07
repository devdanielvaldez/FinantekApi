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
let Clientes = class Clientes {
    registerClients(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { conyuge_id, datos_bancarios, datos_laborales, persona_id, referencias, } = body;
                const insertConyuge = yield (0, mysql_connector_1.execute)("INSERT INTO conyuge (persona_id) VALUES (?)", [conyuge_id]);
                const insertClient = yield (0, mysql_connector_1.execute)("INSERT INTO clientes (conyuge_id, estado, persona_id, emp_id) VALUES (?, ?, ?, ?)", [insertConyuge.insertId, "a", persona_id, token.dataUsuario.emp_id.empresa_id]);
                // insert data banks
                for (const db of datos_bancarios) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO datos_bancarios (banco_codigo_id, n_cuenta, cuenta_default, cliente_id) VALUES (?, ?, ?, ?)", [
                        db.banco_codigo_id,
                        db.n_cuenta,
                        db.cuenta_default,
                        insertClient.insertId,
                    ]);
                }
                // insert datos laborales
                for (const dl of datos_laborales) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO datos_laborales (dlabNombreEmpresa, dlabDepartamento, dlabPosicion, dlabHorarioEntrada, dlabHorarioSalida, dlabNombreSupervisor, dlabIdProvincia, dlabIdMunicipio, dlabCalle, cliente_id, salario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                        dl.dlabNombreEmpresa,
                        dl.dlabDepartamento,
                        dl.dlabPosicion,
                        dl.dlabHorarioEntrada,
                        dl.dlabHorarioSalida,
                        dl.dlabNombreSupervisor,
                        dl.dlabIdProvincia,
                        dl.dlabIdMunicipio,
                        dl.dlabCalle,
                        insertClient.insertId,
                        dl.salario,
                    ]);
                }
                // insert referencias
                for (const rf of referencias) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO referencias (persona_id, cliente_id) VALUES (?, ?)", [rf, insertClient.insertId]);
                }
                return {
                    ok: true,
                    msg: "Cliente registrado correctamente",
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
    updateClient(body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cliente_id, conyuge_id, datos_bancarios, datos_laborales, referencias, } = body;
                // Update conyuge_id if necessary
                if (conyuge_id) {
                    yield (0, mysql_connector_1.execute)("UPDATE clientes SET conyuge_id = ? WHERE cliente_id = ?", [conyuge_id, cliente_id]);
                }
                // Update datos bancarios
                for (const db of datos_bancarios) {
                    yield (0, mysql_connector_1.execute)("UPDATE datos_bancarios SET banco_codigo_id = ?, n_cuenta = ?, cuenta_default = ? WHERE cliente_id = ? AND banco_id = ?", [
                        db.banco_codigo_id,
                        db.n_cuenta,
                        db.cuenta_default,
                        cliente_id,
                        db.datos_bancarios_id, // Assuming there's a unique identifier for each bank account
                    ]);
                }
                // Update datos laborales
                for (const dl of datos_laborales) {
                    yield (0, mysql_connector_1.execute)("UPDATE datos_laborales SET dlabNombreEmpresa = ?, dlabDepartamento = ?, dlabPosicion = ?, dlabHorarioEntrada = ?, dlabHorarioSalida = ?, dlabNombreSupervisor = ?, dlabIdProvincia = ?, dlabIdMunicipio = ?, dlabCalle = ?, salario = ? WHERE cliente_id = ? AND dlab_id = ?", [
                        dl.dlabNombreEmpresa,
                        dl.dlabDepartamento,
                        dl.dlabPosicion,
                        dl.dlabHorarioEntrada,
                        dl.dlabHorarioSalida,
                        dl.dlabNombreSupervisor,
                        dl.dlabIdProvincia,
                        dl.dlabIdMunicipio,
                        dl.dlabCalle,
                        dl.salario,
                        cliente_id,
                        dl.dlab_id, // Assuming there's a unique identifier for each labor data entry
                    ]);
                }
                // Update referencias (assuming a replacement of all references)
                yield (0, mysql_connector_1.execute)("DELETE FROM referencias WHERE cliente_id = ?", [
                    cliente_id,
                ]);
                for (const rf of referencias) {
                    yield (0, mysql_connector_1.execute)("INSERT INTO referencias (persona_id, cliente_id) VALUES (?, ?)", [rf, cliente_id]);
                }
                return {
                    ok: true,
                    msg: "Cliente actualizado correctamente",
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
    getAllClients(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findClientsByEmp = yield (0, mysql_connector_1.execute)(`
        SELECT
        c.cliente_id,
        c.estado,
        p.*,
        dl.*,
        db.*,
        ct.*,
        dr.*,
        cy.*,
        cp.*
    FROM
        clientes c
    LEFT JOIN
        persona p ON c.persona_id = p.persona_id
    LEFT JOIN
        datos_laborales dl ON c.cliente_id = dl.cliente_id
    LEFT JOIN
        datos_bancarios db ON c.cliente_id = db.cliente_id
    LEFT JOIN
        contactos ct ON p.persona_id = ct.persona_id
    LEFT JOIN
        direcciones dr ON p.direccion_id = dr.direccion_id
    LEFT JOIN
        conyuge cy ON c.conyuge_id = cy.conyuge_id
    LEFT JOIN
        persona cp ON cy.persona_id = cp.persona_id
    WHERE
        c.emp_id = ?;
    `, [token.dataUsuario.emp_id.empresa_id]);
                return {
                    ok: true,
                    data: findClientsByEmp,
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
    updateClientStatus(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cliente_id, nuevo_estado } = body;
                // Verificar si el nuevo estado es uno de los valores permitidos ("a", "n", "g", "d", "m")
                const estadosPermitidos = ["a", "n", "g", "d", "m"];
                if (!estadosPermitidos.includes(nuevo_estado)) {
                    return {
                        ok: false,
                        msg: "El estado proporcionado no es válido",
                        status: 400,
                    };
                }
                yield (0, mysql_connector_1.execute)("UPDATE clientes SET estado = ? WHERE cliente_id = ?", [
                    nuevo_estado,
                    cliente_id,
                ]);
                return {
                    ok: true,
                    msg: "Estado del cliente actualizado correctamente",
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
};
__decorate([
    (0, tsoa_1.Post)("/registrar"),
    (0, tsoa_1.Security)('token'),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Registro satisfactorio de cliente", {
        ok: true,
        msg: "Cliente registrado correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Clientes.prototype, "registerClients", null);
__decorate([
    (0, tsoa_1.Put)("/actualizar"),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Actualización satisfactoria del cliente", {
        ok: true,
        msg: "Cliente actualizado correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Clientes.prototype, "updateClient", null);
__decorate([
    (0, tsoa_1.Get)("/all"),
    (0, tsoa_1.Response)(200, "Consulta satisfactoria de clientes", {
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
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Clientes.prototype, "getAllClients", null);
__decorate([
    (0, tsoa_1.Put)("/actualizar-estado-cliente"),
    (0, tsoa_1.Response)(500, "Internal Server Error", {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(200, "Actualización satisfactoria del estado del cliente", {
        ok: true,
        msg: "Estado del cliente actualizado correctamente",
        status: 200,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Clientes.prototype, "updateClientStatus", null);
Clientes = __decorate([
    (0, tsoa_1.Route)("/api/clientes"),
    (0, tsoa_1.Tags)("Clientes")
], Clientes);
exports.default = Clientes;
