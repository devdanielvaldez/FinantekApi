import { Controller, Post, Put, Delete, Body, Response, Route, Tags, Query, Get, Header } from 'tsoa';
import { execute } from '../../api/utils/mysql.connector'; // Reemplaza esto con la forma en que realizas consultas a la base de datos
import { InternalServerError } from '../../interfaces/Errors';

// ... (Definición de las interfaces y otros detalles)

interface UpdateBancoData {
    catalogo_id: number;
    telefono?: string;
    estado?: string;
}

interface UpdateBancoResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface BancoData {
    catalogo_id: number;
    telefono?: string;
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
            const { catalogo_id, telefono } = bancoData;

            const existBank = await execute('SELECT catalog_bank_id FROM bancos WHERE catalog_bank_id = ?', [
                catalogo_id
            ]);

            if(existBank.length > 0) return {
                ok: false,
                msg: "El banco que desea ingresar ya existe en el sistema"
            }

            const insertQuery = `
                INSERT INTO bancos (catalog_bank_id, telefono, emp_id, estado)
                VALUES (?, ?, ?, ?)
            `;

            await execute(insertQuery, [catalogo_id, telefono, token.dataUsuario.emp_id.empresa_id, 'a']);

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
            const query = `SELECT b.banco_id, b.telefono, b.emp_id, b.estado, cb.CodigoBanco, cb.NombreBanco, cb.Bank_id
            FROM bancos b
            LEFT JOIN CatalogoBancos cb ON b.catalog_bank_id = cb.Bank_id
            WHERE emp_id = ?`;
            const empId = token.dataUsuario.emp_id.empresa_id;
            const result = await execute(query, [empId]);

            const bancos = result;

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
public async verBanco(banco_id: number, @Header() token: any): Promise<any | InternalServerError> {
    try {
        const query = `SELECT b.banco_id, b.telefono, b.emp_id, b.estado, cb.CodigoBanco, cb.NombreBanco
        FROM bancos b
        LEFT JOIN CatalogoBancos cb ON b.catalog_bank_id = cb.ID
        WHERE banco_id = ?`;
        const result = await execute(query, [banco_id]);

        if (result.length === 0) {
            return {
                ok: false,
                msg: 'Banco no encontrado',
                status: 404,
            };
        }

        const banco = result;

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
    @Body() updateData: UpdateBancoData,
    @Header() token: any
): Promise<UpdateBancoResponse | InternalServerError> {
    try {
        const { catalogo_id, telefono } = updateData;

        const updateQuery = `
            UPDATE bancos
            SET
                catalog_bank_id = ?,
                telefono = ?
            WHERE banco_id = ?
        `;

        await execute(updateQuery, [catalogo_id, telefono, banco_id]);

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
public async eliminarBanco(banco_id: number, @Header() token:any): Promise<any | InternalServerError> {
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


@Get('/catalogo/bancos')
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
public async getBanksCatalog(@Header() token: any): Promise<any | InternalServerError> {
    try {
        const query = `SELECT * FROM CatalogoBancos`;
        const result = await execute(query);

        const bancos = result.map((row: any) => {
            return {
                bank_id: row.Bank_id,
                codigo: row.CodigoBanco,
                nombre: row.NombreBanco
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
}
