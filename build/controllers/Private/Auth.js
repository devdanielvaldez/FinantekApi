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
const mysql_connector_1 = require("../../api/utils/mysql.connector"); // Reemplaza esto con la forma en que realizas consultas a la base de datos
const helpers_1 = require("../../api/utils/helpers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthController = class AuthController {
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = body;
                const existUser = yield (0, mysql_connector_1.execute)('SELECT * FROM users WHERE username = ?', [username]);
                if (existUser.length === 0) {
                    return { msg: 'Usuario/Contrasena incorrectos', status: 400 };
                }
                if (existUser[0].failed_attempts >= 3) {
                    return { msg: 'Usuario bloqueado por intentos fallidos', status: 400 };
                }
                console.log(existUser);
                const validPassword = yield (0, helpers_1.verifyPassword)(existUser[0].pwd, password);
                console.log(validPassword);
                if (validPassword) {
                    yield (0, mysql_connector_1.execute)('UPDATE users SET failed_attempts = 0, last_login = NOW() WHERE user_id = ?', [existUser[0].user_id]);
                    const empresa = yield (0, mysql_connector_1.execute)('SELECT empresa_id from empleados WHERE empleado_id = ?', [existUser[0].empleado_id]);
                    const firstLogin = existUser[0].first_login === 1;
                    const token = jsonwebtoken_1.default.sign({ user: existUser[0].user_id, emp_id: empresa[0] }, 'token');
                    return {
                        ok: true,
                        msg: 'Inicio de sesion exitoso',
                        status: 200,
                        emp_id: existUser[0].empleado_id,
                        user_id: existUser[0].user_id,
                        accessToken: token,
                        firstLogin: firstLogin
                    };
                }
                else {
                    yield (0, mysql_connector_1.execute)('UPDATE users SET failed_attempts = failed_attempts + 1 WHERE user_id = ?', [existUser[0].user_id]);
                    return { msg: 'Usuario/Contrasena incorrectos', status: 400 };
                }
            }
            catch (err) {
                return {
                    ok: false,
                    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                    error: err,
                    status: 500,
                };
            }
        });
    }
    cambiarContrasena(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, oldPassword, newPassword } = body;
                const user = yield (0, mysql_connector_1.execute)('SELECT pwd, first_login FROM users WHERE user_id = ?', [userId]);
                if (user.length === 0) {
                    return { ok: false, msg: 'Usuario no encontrado', status: 400 };
                }
                if (user[0].first_login !== 1) {
                    return { ok: false, msg: 'Cambio de contraseña no permitido', status: 400 };
                }
                const validPassword = yield (0, helpers_1.verifyPassword)(user[0].pwd, oldPassword);
                if (!validPassword) {
                    return { ok: false, msg: 'Contraseña actual incorrecta', status: 400 };
                }
                const hashedNewPassword = yield (0, helpers_1.hashPassword)(newPassword);
                yield (0, mysql_connector_1.execute)('UPDATE users SET pwd = ?, first_login = 0 WHERE user_id = ?', [hashedNewPassword, userId]);
                return { ok: true, msg: 'Cambio de contraseña exitoso', status: 200 };
            }
            catch (err) {
                console.error(err);
                return { ok: false, msg: 'Error interno del sistema', error: err, status: 500 };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)('/login'),
    (0, tsoa_1.Response)(200, 'SucessLogin', {
        ok: true,
        msg: 'Inicio de sesion exitoso',
        status: 200,
        emp_id: 0,
        user_id: 0,
        accessToken: "asdfasdf",
        firstLogin: true
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(400, 'LoginFailed', {
        msg: "Mensaje de fallo en el login",
        status: 400
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)('/cambiar-contrasena'),
    (0, tsoa_1.Response)(200, 'Cambio de contraseña exitoso', {
        ok: true,
        msg: 'Cambio de contraseña exitoso',
        status: 200,
    }),
    (0, tsoa_1.Response)(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    }),
    (0, tsoa_1.Response)(400, 'Cambio de contraseña fallido', {
        ok: false,
        msg: 'Cambio de contraseña fallido',
        status: 400,
    }),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "cambiarContrasena", null);
AuthController = __decorate([
    (0, tsoa_1.Route)('api/auth'),
    (0, tsoa_1.Tags)('Autenticacion')
], AuthController);
exports.default = AuthController;
