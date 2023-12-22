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
let PlantillaCSVController = class PlantillaCSVController {
    crearPlantillaCSV(nuevaPlantilla, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const { banco_id, titulo_plantilla, campos } = nuevaPlantilla;
                // Crear la plantilla
                const insertPlantillaResult = yield (0, mysql_connector_1.execute)(`INSERT INTO plantillas_csv 
          (banco_id, empresa_id, titulo_plantilla) 
          VALUES (?, ?, ?)`, [banco_id, empId, titulo_plantilla]);
                if (insertPlantillaResult.affectedRows <= 0) {
                    return {
                        ok: false,
                        msg: "No se pudo crear la plantilla CSV",
                        status: 500,
                    };
                }
                const plantillaId = insertPlantillaResult.insertId;
                // Insertar los campos asociados a la plantilla
                for (const campo of campos) {
                    yield (0, mysql_connector_1.execute)(`INSERT INTO campos_plantilla_csv 
            (plantilla_id, titulo_campo, identificador_campo) 
            VALUES (?, ?, ?)`, [plantillaId, campo.titulo_campo, campo.identificador_campo]);
                }
                return {
                    ok: true,
                    msg: "Plantilla CSV creada correctamente",
                    status: 200,
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al crear la plantilla CSV",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    eliminarPlantillaCSV(plantilla_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Eliminar los campos asociados a la plantilla
                yield (0, mysql_connector_1.execute)(`DELETE FROM campos_plantilla_csv WHERE plantilla_id = ?`, [plantilla_id]);
                // Eliminar la plantilla
                const deleteResult = yield (0, mysql_connector_1.execute)(`DELETE FROM plantillas_csv WHERE plantilla_id = ?`, [plantilla_id]);
                if (deleteResult.affectedRows > 0) {
                    return {
                        ok: true,
                        msg: "Plantilla CSV y campos asociados eliminados correctamente",
                        status: 200,
                    };
                }
                else {
                    return {
                        ok: false,
                        msg: "No se pudo eliminar la plantilla CSV o la plantilla no existe",
                        status: 500,
                    };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al eliminar la plantilla CSV",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    obtenerPlantillaCSV(plantilla_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plantilla = yield (0, mysql_connector_1.execute)(`SELECT * FROM plantillas_csv WHERE plantilla_id = ?`, [plantilla_id]);
                if (!plantilla || plantilla.length === 0) {
                    return {
                        ok: false,
                        msg: "No se encontró la plantilla CSV",
                        status: 404,
                    };
                }
                const campos = yield (0, mysql_connector_1.execute)(`SELECT * FROM campos_plantilla_csv WHERE plantilla_id = ?`, [plantilla_id]);
                const plantillaConCampos = Object.assign(Object.assign({}, plantilla[0]), { campos });
                return plantillaConCampos;
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener la plantilla CSV",
                    error: err,
                    status: 500,
                };
            }
        });
    }
    obtenerTodasPlantillasEmpresa(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empId = token.dataUsuario.emp_id.empresa_id;
                const plantillas = yield (0, mysql_connector_1.execute)(`SELECT
        p.*,
        b.*
        FROM plantillas_csv p
        INNER JOIN 
        bancos b ON p.banco_id = b.banco_id
        WHERE empresa_id = ?`, [empId]);
                const plantillasConCampos = [];
                for (const plantilla of plantillas) {
                    const campos = yield (0, mysql_connector_1.execute)(`SELECT * FROM campos_plantilla_csv WHERE plantilla_id = ?`, [plantilla.plantilla_id]);
                    const plantillaConCampos = Object.assign(Object.assign({}, plantilla), { campos });
                    plantillasConCampos.push(plantillaConCampos);
                }
                return {
                    ok: true,
                    data: plantillasConCampos,
                    status: 200,
                    msg: "Plantillas recuperadas corractamente"
                };
            }
            catch (err) {
                return {
                    ok: false,
                    msg: "Error interno del sistema al obtener las plantillas de la empresa",
                    error: err,
                    status: 500,
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/plantillas-csv"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlantillaCSVController.prototype, "crearPlantillaCSV", null);
__decorate([
    (0, tsoa_1.Put)("/plantillas-csv/:plantilla_id"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlantillaCSVController.prototype, "eliminarPlantillaCSV", null);
__decorate([
    (0, tsoa_1.Get)("/plantillas-csv/:plantilla_id"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlantillaCSVController.prototype, "obtenerPlantillaCSV", null);
__decorate([
    (0, tsoa_1.Get)("/plantillas-csv/"),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlantillaCSVController.prototype, "obtenerTodasPlantillasEmpresa", null);
PlantillaCSVController = __decorate([
    (0, tsoa_1.Route)("/api/plantillas"),
    (0, tsoa_1.Tags)("Plantillas CSV")
], PlantillaCSVController);
exports.default = PlantillaCSVController;
