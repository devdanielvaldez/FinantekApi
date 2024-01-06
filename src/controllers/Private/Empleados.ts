import { Body, Get, Head, Header, Post, Put, Query, Response, Route, Tags } from "tsoa";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";
import { RegisterEmpleado } from "../../interfaces/Empleados";
import { execute } from "../../api/utils/mysql.connector";
import { generatePassword, hashPassword } from "../../api/utils/helpers";
import bcrypt from 'bcrypt';

interface CreatedEmpleadoResponse {
    msg: string;
    ok: boolean;
    status: number;
}

interface UpdateEmployeeData {
    cargo?: string;
    salario?: number;
    supervisor_id?: number | null;
    estado?: string;
}


interface UpdateEmpResponse {
    ok: boolean;
    msg: string;
    status: number;
}

interface GetAllEmp {
    ok: boolean;
    data: any;
    error?: any;
    status: number;
}

// pws = 22cd813e

@Route('api/empleados')
@Tags('Empleados')
export default class Empleados {
@Post('/registrar')
@Response<CreatedEmpleadoResponse>(200, "Empleado registrado", {
    msg: "El empleado ha sido registrado correctamente",
    ok: true,
    status: 200
})
@Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
})
public async registrarEmpleado(@Body() body: RegisterEmpleado, @Header() token: any): Promise<CreatedEmpleadoResponse | InternalServerError> {
        const {
            persona,
            empleado,
            contactos,
            direccion,
            rol
        } = body;

        try {
            const findCedula = 'SELECT * FROM users WHERE username = ?';
            const excuteFindCedula = await execute(findCedula, [persona.cedula]);

            if(excuteFindCedula.length > 0) return {
                ok: false,
                status: 400,
                msg: "El usuario que desea registrar ya se encuentra en el sistema"
            }
            // Registrar la dirección
            const direccionInsert = await execute('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
                direccion.provincia_id,
                direccion.municipio_id,
                direccion.direccion,
                direccion.codigo_postal,
                direccion.referencia
            ]);

            const direccionId = direccionInsert.insertId;

            // Registrar la persona
            const personaInsert = await execute('INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                persona.nombre,
                persona.segundo_nombre,
                persona.primer_apellido,
                persona.segundo_apellido,
                persona.fecha_nacimiento,
                persona.sexo,
                'a',
                direccionId,
                persona.cedula
            ]);

            const personaId = personaInsert.insertId;

            // Registrar el empleado asociado a la persona
            const empleadoInsert = await execute('INSERT INTO empleados (persona_id, cargo, salario, fecha_inicio_contrato, empresa_id) VALUES (?, ?, ?, ?, ?)', [
                personaId,
                empleado.cargo,
                empleado.salario,
                empleado.fecha_inicio_contrato,
                token.dataUsuario.emp_id.empresa_id
            ]);

            const empleadoId = empleadoInsert.insertId;

            // Registrar los contactos de la persona
            for (const c of contactos) {
                await execute('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)', [
                    c.telefono,
                    c.movil,
                    c.telefono_oficina,
                    c.correo_electronico,
                    personaId
                ]);
            }

            // const raw_pwd = generatePassword();
            const raw_pwd = 'Finantek123';
            const hash_pwd = await bcrypt.hash(raw_pwd, 10);
            console.log('password generate --->', raw_pwd, hash_pwd);
      
            await execute('INSERT INTO users (username, pwd, persona_id, roll_id, empleado_id) VALUES (?, ?, ?, ?, ?)', [
              persona.cedula,
              hash_pwd,
              personaId,
              rol,
              empleadoId
            ])

            return {
                ok: true,
                msg: `Empleado registrado correctamente, el password es: ${raw_pwd}`,
                status: 200
            };
        } catch (err) {
            console.log(err);
            return {
                ok: false,
                msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                error: err,
                status: 500
            }
        }
}

@Get('/search')
@Response<GetAllEmp>(200, "Buscar empleados", {
    ok: true,
    status: 200,
    data: []
})
@Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
})
public async getAllEmployeesByQuery(
    @Header() token: any,
    @Query('nombre') nombre?: string,
    @Query('apellido') apellido?: string,
    @Query('cargo') cargo?: string
): Promise<GetAllEmp | InternalServerError> {
    try {
        let query = `
        SELECT
        e.empleado_id,
        e.cargo,
        e.salario,
        e.fecha_inicio_contrato,
        e.supervisor_id,
        e.estado AS estado_empleado,
        e.rol,
        p.persona_id,
        p.nombre,
        p.cedula,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        p.fecha_nacimiento,
        p.sexo,
        p.estado AS estado_persona,
        c.contacto_id,
        c.telefono,
        c.movil,
        c.telefono_oficina,
        c.correo_electronico,
        d.provincia_id,
        d.municipio_id,
        d.direccion,
        d.codigo_postal,
        d.referencia
    FROM empleados e
    JOIN persona p ON e.persona_id = p.persona_id
    LEFT JOIN contactos c ON p.persona_id = c.persona_id
    LEFT JOIN direcciones d ON p.direccion_id = d.direccion_id
    WHERE e.empresa_id = ?;`;
        
        const empId = token.dataUsuario.emp_id.empresa_id; // Obtén el emp_id de la empresa de alguna manera

        const conditions = [];

        if (nombre) {
            conditions.push(`p.nombre LIKE '%${nombre}%'`);
        }

        if (apellido) {
            conditions.push(`p.primer_apellido LIKE '%${apellido}%'`);
        }

        if (cargo) {
            conditions.push(`e.cargo LIKE '%${cargo}%'`);
        }

        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }

        const findEmployees = await execute(query, [empId]);

        

        const data = findEmployees.map((p: any) => ({
            empleado: {
                empleado_id: p.empleado_id,
                cargo: p.cargo,
                salario: p.salario,
                fecha_inicio_contrato: p.fecha_inicio_contrato,
                supervisor_id: p.supervisor_id,
                estado: p.estado_empleado,
            },
            persona: {
                persona_id: p.persona_id,
                nombre: p.nombre,
                segundo_nombre: p.segundo_nombre,
                primer_apellido: p.primer_apellido,
                segundo_apellido: p.segundo_apellido,
                fecha_nacimiento: p.fecha_nacimiento,
                sexo: p.sexo,
                estado: p.estado_persona,
                cedula: p.cedula
            },
            contactos: {
                contacto_id: p.contacto_id,
                telefono: p.telefono,
                movil: p.movil,
                telefono_oficina: p.telefono_oficina,
                correo_electronico: p.correo_electronico
            },
            direccion: {
                direccion_id: p.provincia_id,
                municipio: p.municipio_id,
                direccion: p.direccion,
                codigo_postal: p.codigo_postal,
                referencia: p.referencia
            },
            rol: p.rol
        }));

        return {
            ok: true,
            data: data,
            status: 200
        };
    } catch (err) {
        return {
            ok: false,
            msg: "Error interno del sistema, por favor contacte al administrador del sistema",
            error: err,
            status: 500
        };
    }
}

@Put('/update/{empleadoId}')
@Response<UpdateEmpResponse>(200, "Empleado actualizado", {
    ok: true,
    msg: "Empleado actualizado exitosamente",
    status: 200
})
@Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
})
@Response<NotFoundItems>(404, "No se encontró el empleado", {
    ok: false,
    msg: "No se encontró el empleado con el ID proporcionado",
    status: 404
})
public async updateEmployee(
    empleadoId: number,
    @Body() updateData: UpdateEmployeeData
): Promise<UpdateEmpResponse | InternalServerError | NotFoundItems> {
    try {
        const { cargo, salario, supervisor_id, estado } = updateData;

        // Verificar si el empleado existe
        const existEmployee = await execute('SELECT empleado_id FROM empleados WHERE empleado_id = ?', [empleadoId]);
        
        if (existEmployee.length === 0) {
            return {
                ok: false,
                msg: "No se encontró el empleado con el ID proporcionado",
                status: 404
            };
        }

        const updateQuery = `
            UPDATE empleados
            SET
                cargo = ?,
                salario = ?,
                supervisor_id = ?,
                estado = ?
            WHERE empleado_id = ?
        `;

        await execute(updateQuery, [cargo, salario, supervisor_id, estado, empleadoId]);

        return {
            ok: true,
            msg: "Empleado actualizado exitosamente",
            status: 200
        };
    } catch (err) {
        return {
            ok: false,
            msg: "Error interno del sistema, por favor contacte al administrador del sistema",
            error: err,
            status: 500
        };
    }
}



}