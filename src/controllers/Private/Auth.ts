import { Body, Post, Response, Route, Tags } from "tsoa";
import { InternalServerError } from "../../interfaces/Errors";
import { execute } from '../../api/utils/mysql.connector'; // Reemplaza esto con la forma en que realizas consultas a la base de datos
import { hashPassword, verifyPassword } from "../../api/utils/helpers";
import jwt from 'jsonwebtoken';

interface SuccessLogin {
    ok: boolean;
    msg: string;
    status: number;
    emp_id: number;
    user_id: number;
    accessToken: string;
    firstLogin: boolean;
}

interface LoginBody {
    username: string;
    password: string;
}

interface FailedLogin {
    msg: string;
    status: number;
}

interface SuccessResponse {
    ok: boolean;           // Indica si la respuesta es exitosa
    msg: string;           // Mensaje descriptivo
    status: number;        // Código de estado HTTP
}

interface FailedResponse {
    ok: boolean;           // Indica si la respuesta es un fracaso
    msg: string;           // Mensaje descriptivo del error
    status: number;        // Código de estado HTTP
    error?: any;           // Detalles adicionales del error, opcional
}

interface ChangePassBody {
    userId: string, oldPassword: string, newPassword: string
}


@Route('api/auth')
@Tags('Autenticacion')
export default class AuthController {

    @Post('/login')
    @Response<SuccessLogin>(200, 'SucessLogin', {
        ok: true,
        msg: 'Inicio de sesion exitoso',
        status: 200,
        emp_id: 0,
        user_id: 0,
        accessToken: "asdfasdf",
        firstLogin: true
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    @Response<FailedLogin>(400,'LoginFailed', {
        msg: "Mensaje de fallo en el login",
        status: 400
    })
    public async login(@Body() body: LoginBody): Promise<SuccessLogin | InternalServerError | FailedLogin> {
        try {

                const {
                    username,
                    password
                } = body;

                const existUser = await execute('SELECT * FROM users WHERE username = ?', [username]);
                if (existUser.length === 0) {
                    return { msg: 'Usuario/Contrasena incorrectos', status: 400 };
                }
        
                if (existUser[0].failed_attempts >= 3) {
                    return { msg: 'Usuario bloqueado por intentos fallidos', status:400 }
                }
                console.log(existUser);
                const validPassword = await verifyPassword(existUser[0].pwd, password);
                console.log(validPassword);

                if (validPassword) {
                    await execute('UPDATE users SET failed_attempts = 0, last_login = NOW() WHERE user_id = ?', [existUser[0].user_id]);
                    const empresa = await execute('SELECT empresa_id from empleados WHERE empleado_id = ?', [existUser[0].empleado_id])
                    
                    const firstLogin = existUser[0].first_login === 1;
                    const token = jwt.sign({ user: existUser[0].user_id, emp_id: empresa[0] }, 'token');

                    return {
                        ok: true,
                        msg: 'Inicio de sesion exitoso',
                        status: 200,
                        emp_id: existUser[0].empleado_id,
                        user_id: existUser[0].user_id,
                        accessToken: token,
                        firstLogin: firstLogin
                    }
                } else {
                    await execute('UPDATE users SET failed_attempts = failed_attempts + 1 WHERE user_id = ?', [existUser[0].user_id]);
                    return { msg: 'Usuario/Contrasena incorrectos', status: 400 };
                }

        } catch(err) {
            return {
                ok: false,
                msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                error: err,
                status: 500,
            };
        }
    }

    @Post('/cambiar-contrasena')
    @Response<SuccessResponse>(200, 'Cambio de contraseña exitoso', {
        ok: true,
        msg: 'Cambio de contraseña exitoso',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    @Response<FailedResponse>(400, 'Cambio de contraseña fallido', {
        ok: false,
        msg: 'Cambio de contraseña fallido',
        status: 400,
    })
    public async cambiarContrasena(@Body() body:ChangePassBody): Promise<SuccessResponse | InternalServerError | FailedResponse> {
        try {
            const { userId, oldPassword, newPassword } = body;

            const user = await execute('SELECT pwd, first_login FROM users WHERE user_id = ?', [userId]);

            if (user.length === 0) {
                return { ok: false, msg: 'Usuario no encontrado', status: 400 };
            }

            if (user[0].first_login !== 1) {
                return { ok: false, msg: 'Cambio de contraseña no permitido', status: 400 };
            }

            const validPassword = await verifyPassword(user[0].pwd, oldPassword);

            if (!validPassword) {
                return { ok: false, msg: 'Contraseña actual incorrecta', status: 400 };
            }

            const hashedNewPassword = await hashPassword(newPassword);
            await execute('UPDATE users SET pwd = ?, first_login = 0 WHERE user_id = ?', [hashedNewPassword, userId]);

            return { ok: true, msg: 'Cambio de contraseña exitoso', status: 200 };

        } catch (err) {
            console.error(err);
            return { ok: false, msg: 'Error interno del sistema', error: err, status: 500 };
        }
    }
}