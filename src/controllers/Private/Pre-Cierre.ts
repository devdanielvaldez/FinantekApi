import { Body, Post, Response, Header, Route, Tags } from 'tsoa';
import { execute } from '../../api/utils/mysql.connector';

interface PreCierreResponse {
    ok: boolean;
    msg: string;
    status: number;
    // Otros campos que puedan ser necesarios
}

interface InternalServerError {
    ok: boolean;
    msg: string;
    error: any;
    status: number;
}

@Route("/api/pre-cierre")
@Tags("Pre-Cierre")
export default class PreCierreController {

    @Post('/registrar')
    @Response<PreCierreResponse>(200, 'Pre-cierre registrado', {
        ok: true,
        msg: 'Pre-cierre registrado exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async registrarPreCierre(@Body() preCierreData: { montoTotal: number, comentarios: string }, @Header() token: any): Promise<PreCierreResponse | InternalServerError> {
        try {
            // Aquí van los detalles de implementación para registrar un pre-cierre
            // Por ejemplo, extraer datos del preCierreData y realizar una inserción en la base de datos.
            const { montoTotal, comentarios } = preCierreData;

                    // Obtener la fecha de hoy en formato 'YYYY-MM-DD'
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

        // Verificar si ya existe un pre-cierre para la fecha de hoy (ignorando la hora)
        const checkQuery = `
            SELECT * FROM pre_cierres 
            WHERE empresa_id = ? AND DATE(fecha) = ?
        `;
        const existingPreCierre = await execute(checkQuery, [token.dataUsuario.emp_id.empresa_id, todayString]);

        if (existingPreCierre.length > 0) {
            return {
                ok: false,
                msg: 'Ya existe un pre-cierre registrado para la fecha de hoy',
                status: 400, // O el código de estado que consideres apropiado
            };
        }

            const insertQuery = `
                INSERT INTO pre_cierres (empresa_id, monto_total, estado, comentarios)
                VALUES (?, ?, ?, ?)
            `;

            await execute(insertQuery, [token.dataUsuario.emp_id.empresa_id, montoTotal, 'AC', comentarios]);

            return {
                ok: true,
                msg: 'Pre-cierre registrado exitosamente',
                status: 200,
            };
        } catch (err) {
            return {
                ok: false,
                msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
                error: err,
                status: 500,
            };
        }
    }
}