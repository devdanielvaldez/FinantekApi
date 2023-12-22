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
let DesembolsoController = class DesembolsoController {
    getAllDesembolso(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const loanRequests = yield (0, mysql_connector_1.execute)(`
        SELECT 
          sp.*, 
          db.*, 
          b.*,
          c.*,
          p.*,
          co.*
        FROM 
          solicitudes_prestamo sp
        INNER JOIN 
          datos_bancarios db ON sp.cliente_id = db.cliente_id
        INNER JOIN 
          bancos b ON db.banco_codigo_id = b.banco_id
        INNER JOIN
            clientes c ON c.cliente_id = sp.cliente_id
        INNER JOIN
            persona p ON p.persona_id = c.persona_id
        INNER JOIN
            contactos co ON co.persona_id = p.persona_id
        WHERE 
          sp.empresa_id = ? AND 
          sp.estado_solicitud = ? AND 
          db.cuenta_default = 1
      `, [empId, 'PE_DE']);
                return {
                    ok: true,
                    data: loanRequests,
                    status: 200
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
    desembolsarPorCliente(data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeholders = data.ids.map((_, index) => '?').join(', ');
            // La consulta SQL
            const query = `UPDATE solicitudes_prestamo SET estado_solicitud = 'AP_DE' WHERE solicitud_id IN (${placeholders})`;
            // Ejecutar la consulta
            try {
                yield (0, mysql_connector_1.execute)(query, data.ids);
                console.log('Estado de solicitud actualizado con éxito.');
                return {
                    ok: true,
                    msg: "Prestamos desembolsados corractamente",
                    status: 200
                };
            }
            catch (error) {
                console.error('Error al actualizar el estado de solicitud:', error);
                return {
                    ok: false,
                    msg: "Error interno del sistema, por favor contacte al administrador",
                    error: error,
                    status: 500
                };
            }
        });
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
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DesembolsoController.prototype, "desembolsarPorCliente", null);
DesembolsoController = __decorate([
    (0, tsoa_1.Route)('api/solicitudes-desembolsar'),
    (0, tsoa_1.Tags)('Solicitudes a Desembolsar')
], DesembolsoController);
exports.default = DesembolsoController;
