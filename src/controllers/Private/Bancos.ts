import { Controller, Post, Put, Delete, Body, Response, Route, Tags, Query, Get, Header } from 'tsoa';
import { execute } from '../../api/utils/mysql.connector'; // Reemplaza esto con la forma en que realizas consultas a la base de datos
import { InternalServerError } from '../../interfaces/Errors';

// ... (Definición de las interfaces y otros detalles)

interface UpdateBancoData {
    nombre?: string;
    telefono?: string;
    codigo?: string;
}

interface UpdateBancoResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface BancoData {
    nombre: string;
    telefono?: string;
    codigo: string;
}

interface BancoResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface BancoWithRelations {
    ok?: boolean;
    banco_id: number;
    nombre: string;
    telefono?: string;
    codigo: string;
}

interface GetBancosResponse {
    ok: boolean;
    data: BancoWithRelations[];
    status: number;
}

@Route('api/bancos')
@Tags('Bancos')
export default class BancosController {

    @Post('/registrar')
    @Response<BancoResponse>(200, 'Banco registrado', {
        ok: true,
        msg: 'Banco registrado exitosamente',
        status: 200,
    })
    @Response<InternalServerError>(500, 'Internal Server Error', {
        ok: false,
        msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
        error: {},
        status: 500,
    })
    @Response<any>(400, "Banco Existe", {
        ok: false,
        msg: "El banco que desea ingresar ya existe en el sistema."
    })
    public async registrarBanco(@Body() bancoData: BancoData, @Header() token: any): Promise<BancoResponse | InternalServerError | any> {
        try {
            const { nombre, telefono, codigo } = bancoData;

            const existBank = await execute('SELECT nombre, codigo FROM bancos WHERE codigo = ?', [
                codigo
            ]);

            if(existBank.length > 0) return {
                ok: false,
                msg: "El banco que desea ingresar ya existe en el sistema"
            }

            const insertQuery = `
                INSERT INTO bancos (nombre, telefono, codigo, emp_id, estado)
                VALUES (?, ?, ?, ?, ?)
            `;

            await execute(insertQuery, [nombre, telefono, codigo, token.dataUsuario.emp_id.empresa_id, 'a']);

            return {
                ok: true,
                msg: 'Banco registrado exitosamente',
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

    @Get('/ver-todos')
    @Response<GetBancosResponse>(200, 'Bancos obtenidos', {
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
    public async verTodosLosBancos(@Header() token: any): Promise<GetBancosResponse | InternalServerError> {
        try {
            const query = `SELECT * FROM bancos WHERE emp_id = ?`;
            const empId = token.dataUsuario.emp_id.empresa_id;
            const result = await execute(query, [empId]);

            const bancos: BancoWithRelations[] = result.map((row: any) => {
                return {
                    banco_id: row.banco_id,
                    nombre: row.nombre,
                    telefono: row.telefono,
                    codigo: row.codigo,
                    estado: row.estado
                };
            });

            return {
                ok: true,
                data: bancos,
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

@Get('/ver/{banco_id}')
@Response<any>(200, 'Banco obtenido', {
    ok: true,
    data: null,
    status: 200,
})
@Response<InternalServerError>(500, 'Internal Server Error', {
    ok: false,
    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
    error: {},
    status: 500,
})
public async verBanco(banco_id: number): Promise<any | InternalServerError> {
    try {
        const query = `SELECT * FROM bancos WHERE banco_id = ?`;
        const result = await execute(query, [banco_id]);

        if (result.length === 0) {
            return {
                ok: false,
                msg: 'Banco no encontrado',
                status: 404,
            };
        }

        const banco: BancoWithRelations = {
            banco_id: result[0].banco_id,
            nombre: result[0].nombre,
            telefono: result[0].telefono,
            codigo: result[0].codigo,
        };

        return {
            ok: true,
            data: banco,
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

@Put('/actualizar/{banco_id}')
@Response<any>(200, 'Banco actualizado', {
    ok: true,
    msg: 'Banco actualizado exitosamente',
    status: 200,
})
@Response<InternalServerError>(500, 'Internal Server Error', {
    ok: false,
    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
    error: {},
    status: 500,
})
public async actualizarBanco(
    banco_id: number,
    @Body() updateData: UpdateBancoData
): Promise<UpdateBancoResponse | InternalServerError> {
    try {
        const { nombre, telefono, codigo } = updateData;

        const updateQuery = `
            UPDATE bancos
            SET
                nombre = ?,
                telefono = ?,
                codigo = ?
            WHERE banco_id = ?
        `;

        await execute(updateQuery, [nombre, telefono, codigo, banco_id]);

        return {
            ok: true,
            msg: 'Banco actualizado exitosamente',
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

@Delete('/eliminar/{banco_id}')
@Response<any>(200, 'Banco eliminado', {
    ok: true,
    msg: 'Banco eliminado exitosamente',
    status: 200,
})
@Response<InternalServerError>(500, 'Internal Server Error', {
    ok: false,
    msg: 'Error interno del sistema, por favor contacte al administrador del sistema',
    error: {},
    status: 500,
})
public async eliminarBanco(banco_id: number): Promise<any | InternalServerError> {
    try {
        const deleteQuery = 'DELETE FROM bancos WHERE banco_id = ?';
        await execute(deleteQuery, [banco_id]);

        return {
            ok: true,
            msg: 'Banco eliminado exitosamente',
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
