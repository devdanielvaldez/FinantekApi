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
const prestamos_1 = require("./../../api/utils/prestamos");
const tsoa_1 = require("tsoa");
const frecuenciasDias = {
    DI: 1,
    SM: 7,
    CT: 14,
    QU: 15,
    ME: 30,
    BM: 60,
    TM: 90,
    SEM: 180,
    AN: 360
};
let PrestamoController = class PrestamoController {
    generarPrestamo(datosPrestamo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, cuota_seguro, numeroDeMeses } = datosPrestamo;
                const loan = (0, prestamos_1.generarPlanPrestamo)(fecha_inicial, +monto_aprobado, +tasa_interes, +cuota_seguro, frecuencia_pago, +numeroDeMeses, frecuenciasDias);
                console.log(loan);
                return {
                    ok: true,
                    msg: "Success",
                    status: 200,
                    data: loan
                };
            }
            catch (err) {
                console.log(err);
                return {
                    ok: false,
                    msg: "Error interno del sistema al generar el préstamo",
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/generar"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrestamoController.prototype, "generarPrestamo", null);
PrestamoController = __decorate([
    (0, tsoa_1.Route)("/api/prestamos"),
    (0, tsoa_1.Tags)("Prestamos")
], PrestamoController);
exports.default = PrestamoController;
