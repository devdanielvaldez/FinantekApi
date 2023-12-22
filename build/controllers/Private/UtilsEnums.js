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
const utils_1 = require("../../api/utils/utils");
const UploadFiles_1 = require("./UploadFiles");
let UtilsEnumsController = class UtilsEnumsController {
    getProvincias(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provincias = yield (0, mysql_connector_1.execute)('SELECT * FROM provincias');
                return {
                    ok: true,
                    status: 200,
                    data: provincias
                };
            }
            catch (err) {
                return {
                    ok: false,
                    status: 500,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err
                };
            }
        });
    }
    getMunicipios(token, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const municipios = yield (0, mysql_connector_1.execute)('SELECT * FROM municipios WHERE provincia_id = ?', [id]);
                return {
                    ok: true,
                    status: 200,
                    data: municipios
                };
            }
            catch (err) {
                return {
                    ok: false,
                    status: 500,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err
                };
            }
        });
    }
    tiposPrestamos() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    tiposFrecuencias(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    ok: true,
                    status: 200,
                    data: utils_1.frecuenciasLiteral
                };
            }
            catch (err) {
                return {
                    ok: false,
                    status: 500,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err
                };
            }
        });
    }
    codesPlantillas(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    ok: true,
                    status: 200,
                    data: utils_1.codesPlantillas
                };
            }
            catch (err) {
                return {
                    ok: false,
                    status: 500,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err
                };
            }
        });
    }
    uploadFiles(files, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(files.file);
                const uplaodRes = yield (0, UploadFiles_1.uploadToS3)(UploadFiles_1.s3, files.file);
                if (uplaodRes.success) {
                    return uplaodRes;
                }
                else {
                    return uplaodRes;
                }
            }
            catch (err) {
                return {
                    ok: false,
                    status: 500,
                    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                    error: err
                };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/provincias'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "getProvincias", null);
__decorate([
    (0, tsoa_1.Get)('/municipios/:id'),
    __param(0, (0, tsoa_1.Header)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "getMunicipios", null);
__decorate([
    (0, tsoa_1.Get)('/tipos-prestamos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "tiposPrestamos", null);
__decorate([
    (0, tsoa_1.Get)('/tipos-frecuencias'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "tiposFrecuencias", null);
__decorate([
    (0, tsoa_1.Get)('/codes'),
    __param(0, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "codesPlantillas", null);
__decorate([
    (0, tsoa_1.Post)('/files'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UtilsEnumsController.prototype, "uploadFiles", null);
UtilsEnumsController = __decorate([
    (0, tsoa_1.Route)('/api/utils'),
    (0, tsoa_1.Tags)('Utils')
], UtilsEnumsController);
exports.default = UtilsEnumsController;
