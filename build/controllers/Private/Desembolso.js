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
let DesembolsoController = class DesembolsoController {
    getAllDesembolso(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const solicitudes_a_desembolsar = [
                    {
                        no_solicitud: 1,
                        cliente: {
                            cliente_id: 1,
                            nombre: "Daniel Abner",
                            apellido: "Valdez Guzman",
                            cedula: "40211111110",
                        },
                        prestamo: {
                            monto_aprobado: 23481,
                        },
                        banco: {
                            codigo_banco: "BHD",
                            numero_cuenta: "2917491031"
                        },
                        estado: "PE_DE"
                    },
                    {
                        no_solicitud: 2,
                        cliente: {
                            cliente_id: 2,
                            nombre: "Noelia Alexandra",
                            apellido: "Rivera Fabian",
                            cedula: "40201234510",
                        },
                        prestamo: {
                            monto_aprobado: 3481,
                        },
                        banco: {
                            codigo_banco: "BRD",
                            numero_cuenta: "1239418243"
                        },
                        estado: "PE_DE"
                    },
                    {
                        no_solicitud: 3,
                        cliente: {
                            cliente_id: 3,
                            nombre: "Brandon",
                            apellido: "Long Jones",
                            cedula: "402396658908"
                        },
                        prestamo: {
                            monto_aprobado: 23523
                        },
                        banco: {
                            codigo_banco: "BPD",
                            numero_cuenta: "9909774956"
                        },
                        estado: "PE_DE"
                    },
                    {
                        no_solicitud: 4,
                        cliente: {
                            cliente_id: 4,
                            nombre: "Cynthia",
                            apellido: "Estrada Wood",
                            cedula: "402726236483"
                        },
                        prestamo: {
                            monto_aprobado: 47585
                        },
                        banco: {
                            codigo_banco: "BPD",
                            numero_cuenta: "2749259423"
                        },
                        estado: "PE_DE"
                    },
                    {
                        no_solicitud: 5,
                        cliente: {
                            cliente_id: 5,
                            nombre: "Andrew",
                            apellido: "Waters Johnson",
                            cedula: "402437017521"
                        },
                        prestamo: {
                            monto_aprobado: 14544
                        },
                        banco: {
                            codigo_banco: "BRD",
                            numero_cuenta: "0447918513"
                        },
                        estado: "PE_DE"
                    }
                ];
                return {
                    ok: true,
                    status: 200,
                    data: solicitudes_a_desembolsar
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador",
                    error: err,
                    status: 500
                };
            }
        });
    }
    desembolsarPorCliente() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
};
__decorate([
    (0, tsoa_1.Get)('all'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DesembolsoController.prototype, "getAllDesembolso", null);
__decorate([
    (0, tsoa_1.Post)('/desembolsar-por-cliente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DesembolsoController.prototype, "desembolsarPorCliente", null);
DesembolsoController = __decorate([
    (0, tsoa_1.Route)('api/solicitudes-desembolsar'),
    (0, tsoa_1.Tags)('Solicitudes a Desembolsar')
], DesembolsoController);
exports.default = DesembolsoController;
