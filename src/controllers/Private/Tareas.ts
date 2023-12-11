import { Post, Put, Delete, Body, Response, Route, Tags, Query, Get, Header } from 'tsoa';
import { execute } from '../../api/utils/mysql.connector';
import { InternalServerError } from '../../interfaces/Errors';
import { Empleado } from '../../interfaces/Empleados';

// Interfaces defining data structures
interface CreateTareaData {
    empleado_id: number;
    descripcion: string;
    fecha: Date;
    prioridad: 'alta' | 'media' | 'baja';
    // estado: 'en' | 'pe' | 'de' | 'co' | 'su' | 'ca';
}

interface CreateTareaResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface UpdateTareaData {
    descripcion?: string;
    fecha?: Date;
    prioridad?: 'alta' | 'media' | 'baja';
    estado?: 'en' | 'pe' | 'de' | 'co' | 'su' | 'ca';
}

interface UpdateTareaResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface DeleteTareaResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface TareaWithRelations {
    tarea_id: number;
    descripcion: string;
    fecha: Date;
    prioridad: 'alta' | 'media' | 'baja';
    estado: 'en' | 'pe' | 'de' | 'co' | 'su' | 'ca';
    empleado: Empleado;
    supervisor: Empleado;
}

interface GetTareasResponse {
    ok: boolean;
    data: TareaWithRelations[];
    status: number;
}



@Route('api/tareas')
@Tags('Tareas')
export default class TareasController {

    @Post('/crear')
    @Response<CreateTareaResponse>(200, 'Tarea creada', {
        ok: true,
        msg: 'Tarea creada exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async crearTarea(@Body() tareaData: CreateTareaData, @Header() token: any): Promise<CreateTareaResponse | InternalServerError> {
        try {
            const { empleado_id, descripcion, fecha, prioridad } = tareaData;
            const userId = token.dataUsuario.user
            const insertQuery = `
                INSERT INTO tareas (empleado_id, supervisor_id, descripcion, fecha, prioridad, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await execute(insertQuery, [empleado_id, userId, descripcion, fecha, prioridad, 'pe']);

            return {
                ok: true,
                msg: 'Tarea creada exitosamente',
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

    @Put('/update/{tarea_id}')
    // Decoradores @Response y otros detalles similares
    @Response<any>(200, 'Tarea Actualizada' ,{
        ok: true,
        msg: 'Tarea actualizada exitosamente',
        status: 200
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async actualizarTarea(
        tarea_id: number,
        @Body() updateData: UpdateTareaData,
        @Header() token: any
    ): Promise<UpdateTareaResponse | InternalServerError> {
        try {
            const { descripcion, fecha, prioridad, estado } = updateData;

            const updateQuery = `
                UPDATE tareas
                SET
                    descripcion = ?,
                    fecha = ?,
                    prioridad = ?,
                    estado = ?
                WHERE tarea_id = ?
            `;

            await execute(updateQuery, [descripcion, fecha, prioridad, estado, tarea_id]);

            return {
                ok: true,
                msg: 'Tarea actualizada exitosamente',
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

    @Delete('/delete/{tarea_id}')
    // Decoradores @Response y otros detalles similares
    @Response<any>(200, 'Tarea Eliminada' ,{
        ok: true,
        msg: 'Tarea Eliminada exitosamente',
        status: 200
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    public async eliminarTarea(tarea_id: number): Promise<DeleteTareaResponse | InternalServerError> {
        try {
            const deleteQuery = 'DELETE FROM tareas WHERE tarea_id = ?';
            await execute(deleteQuery, [tarea_id]);

            return {
                ok: true,
                msg: 'Tarea eliminada exitosamente',
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

    @Get('/mis-tareas')
    @Response<GetTareasResponse>(200, 'Tareas obtenidas', {
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
    public async obtenerMisTareas(@Header() token: any): Promise<GetTareasResponse | InternalServerError> {
        try {
            const user = token.dataUsuario.user;
            const query = `
                SELECT t.*, e1.*, e2.*
                FROM tareas t
                LEFT JOIN empleados e1 ON t.empleado_id = e1.empleado_id
                LEFT JOIN empleados e2 ON t.supervisor_id = e2.empleado_id
                WHERE t.empleado_id = ? OR t.supervisor_id = ?
            `;

            const result = await execute(query, [user, user]);

            const tareas: TareaWithRelations[] = result.map((row: any) => {
                return {
                    tarea_id: row.tarea_id,
                    descripcion: row.descripcion,
                    fecha: row.fecha,
                    prioridad: row.prioridad,
                    estado: row.estado,
                    empleado: {
                        empleado_id: row.empleado_id,
                        // Otros campos del empleado
                    },
                    supervisor: {
                        empleado_id: row.supervisor_id,
                        // Otros campos del supervisor
                    },
                };
            });

            return {
                ok: true,
                data: tareas,
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
