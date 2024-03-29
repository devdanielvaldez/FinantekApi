import { Controller, Post, Body, Response, Route, Tags, Get, Put, Delete, Header } from 'tsoa';
import { execute } from '../../api/utils/mysql.connector'; // Reemplaza esto con la forma en que realizas consultas a la base de datos
import { InternalServerError } from '../../interfaces/Errors';
import { Noticia } from '../../interfaces/Noticias';
import { formatDate } from '../../api/utils/helpers';
import moment from "moment";

interface RegistrarNoticiaRequest {
    titulo: string;
    descripcion: string;
    fecha_vencimiento: String;
}

interface RegistrarNoticiaResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface GetAllNoticiasResponse {
    ok: boolean;
    data: Noticia[];
    status: number;
}

interface UpdateNoticiaData {
    titulo?: string;
    descripcion?: string;
    fecha_vencimiento?: Date;
}

interface UpdateNoticiaResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface DeleteNoticiaResponse {
    ok: boolean;
    msg: string;
    status: number;
}


@Route('api/noticias')
@Tags('Noticias')
export default class NoticiasController {

    @Post('/registrar')
    @Response<RegistrarNoticiaResponse>(200, 'Noticia registrada', {
        ok: true,
        msg: 'Noticia registrada exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async registrarNoticia(@Body() body: RegistrarNoticiaRequest, @Header() token: any): Promise<RegistrarNoticiaResponse | InternalServerError> {
        try {
            const {
                titulo,
                descripcion,
                fecha_vencimiento,
            } = body;

            const empId = token.dataUsuario.emp_id.empresa_id;

            // Realiza validaciones si es necesario

            // Inserta la noticia en la base de datos
            await execute('INSERT INTO noticias (empresa_id, titulo, descripcion, persona_id, fecha_publicacion, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)', [
                empId,
                titulo,
                descripcion,
                null,
                formatDate(moment(), 'n'),
                fecha_vencimiento,
            ]);

            return {
                ok: true,
                msg: 'Noticia registrada exitosamente',
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

    @Get('/empresa')
    @Response<GetAllNoticiasResponse>(200, 'Noticias de la empresa', {
        ok: true,
        data: [],
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async getNoticiasByEmpresa(@Header() token: any): Promise<GetAllNoticiasResponse | InternalServerError> {
        try {
            const empId = token.dataUsuario.emp_id.empresa_id;
            const noticias = await execute(`SELECT * from noticias WHERE empresa_id = ?`, [
                empId
            ]);

            const data: Noticia[] = noticias.map((n: any) => ({
                noticia_id: n.noticia_id,
                titulo: n.titulo,
                descripcion: n.descripcion,
                fecha_publicacion: n.fecha_publicacion,
                fecha_vencimiento: n.fecha_vencimiento,
                fecha_creacion: n.fecha_creacion,
                fecha_actualizacion: n.fecha_actualizacion,
            }));

            return {
                ok: true,
                data: data,
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

    @Put('/update/{noticia_id}')
    @Response<UpdateNoticiaResponse>(200, 'Noticia actualizada', {
        ok: true,
        msg: 'Noticia actualizada exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async updateNoticia(
        noticia_id: number,
        @Body() updateData: UpdateNoticiaData
    ): Promise<UpdateNoticiaResponse | InternalServerError> {
        try {
            const { titulo, descripcion, fecha_vencimiento } = updateData;

            const updateQuery = `
                UPDATE noticias
                SET
                    titulo = ?,
                    descripcion = ?,
                    fecha_vencimiento = ?
                WHERE noticia_id = ?
            `;

            await execute(updateQuery, [titulo, descripcion, fecha_vencimiento, noticia_id]);

            return {
                ok: true,
                msg: 'Noticia actualizada exitosamente',
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

    @Delete('/delete/{noticia_id}')
    @Response<DeleteNoticiaResponse>(200, 'Noticia eliminada', {
        ok: true,
        msg: 'Noticia eliminada exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async deleteNoticia(
        noticia_id: number
    ): Promise<DeleteNoticiaResponse | InternalServerError> {
        try {
            const deleteQuery = 'DELETE FROM noticias WHERE noticia_id = ?';
            await execute(deleteQuery, [noticia_id]);

            return {
                ok: true,
                msg: 'Noticia eliminada exitosamente',
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
