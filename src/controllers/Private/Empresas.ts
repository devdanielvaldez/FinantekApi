import { Get, Route, Post, Body, SuccessResponse, Response, ValidateError, Queries, Tags, Put } from "tsoa";
import { ActualizarEmpresa, RegistrarEmpresa } from "../../interfaces/Empresas";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";
import { QuerysEmpresasFind } from "../../interfaces/Querys";
import { generatePassword, hashPassword } from "../../api/utils/helpers";
import bcrypt from 'bcrypt';

interface RegistrarEmpresaResponse {
  msg: string;
  ok: boolean;
  status: number;
  error?: any;
}

interface ActualizarEmpresaResponse {
  msg: string;
  ok: boolean;
  status: number;
  error?: any;
}

interface CreatedEmpResponse {
  msg: string;
  ok: boolean;
  status: number;
}

interface ConsultaEmpresasResponse {
  ok: boolean;
  data: any;
  status: number;
}

// pwd = bf063abe

@Route("api/empresas")
@Tags('Empresas')
export default class Empresas {
  @Post("/registrar")
  @Response<CreatedEmpResponse>(200, "Empresa registrada", {
    msg: "La empresa ha sido registrada corractamente",
    ok: true,
    status: 200
  })
  @Response<ValidateError>(400, "Empresa Existe", {
    message: "La empresa que desea registrar ya se encuentra en el sistema",
    status: 400,
    name: "ErrorExistEmp"
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
  })
  public async registrarEmpresas(@Body() body: RegistrarEmpresa): Promise<RegistrarEmpresaResponse | ValidateError> {
    try {
      const {
        nombre_completo,
        nombre_corto,
        rnc,
        website,
        persona,
        direccion,
        contactos,
      } = body;

      const existEmp = await execute(`SELECT nombre_completo, emp_id FROM empresas WHERE rnc = ${rnc}`);

      if (existEmp.length > 0) {
        return {
          message: "La empresa que desea registrar ya se encuentra en el sistema",
          status: 400,
          name: "ErrorExistEmp"
        }
      }

      // registra la dirección de la persona
      const direccionResult = await execute('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
        persona.direccion.provincia_id,
        persona.direccion.municipio_id,
        persona.direccion.direccion,
        persona.direccion.codigo_postal,
        persona.direccion.referencia,
      ]);

      const direccion_id = direccionResult.insertId;

      // Primero, registra la persona y obtén su persona_id generado
      const personaResult = await execute('INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        persona.persona.nombre,
        persona.persona.segundo_nombre,
        persona.persona.primer_apellido,
        persona.persona.segundo_apellido,
        persona.persona.fecha_nacimiento,
        persona.persona.sexo,
        persona.persona.estado,
        direccion_id, // Establece temporalmente como 0 hasta que se obtenga el valor real generado
        persona.persona.cedula
      ]);

      const persona_id = personaResult.insertId;

      // Registra los contactos de la persona
      for (const contacto of persona.contactos) {
        await execute('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)', [
          contacto.telefono,
          contacto.movil,
          contacto.telefono_oficina,
          contacto.correo_electronico,
          persona_id
        ]);
      }

      const direccionEmpResult = await execute('INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)', [
        direccion.provincia_id,
        direccion.municipio_id,
        direccion.direccion,
        direccion.codigo_postal,
        direccion.referencia,
      ]);

      const direccion_id_emp = direccionEmpResult.insertId;

      // Finalmente, registra la empresa
      const empresaResult = await execute('INSERT INTO empresas (nombre_completo, nombre_corto, rnc, website, direccion_id) VALUES (?, ?, ?, ?, ?)', [
        nombre_completo,
        nombre_corto,
        rnc,
        website,
        direccion_id_emp,
      ]);

      const emp_id = empresaResult.insertId;

      for (const contacto of contactos) {
        await execute('INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, emp_id) VALUES (?, ?, ?, ?, ?)', [
          contacto.telefono,
          contacto.movil,
          contacto.telefono_oficina,
          contacto.correo_electronico,
          emp_id
        ]);
      }
      

      // Actualiza los contactos de la persona con el emp_id (empresa_id) real generado
      await execute('UPDATE contactos SET emp_id = ? WHERE persona_id = ?', [emp_id, persona_id]);

      const saltRounds = 10; // Número de rondas de sal (más rondas, más seguro pero más lento)
  
      // Generar el hash del password
      const raw_pwd = generatePassword();
      const hash_pwd = await bcrypt.hash(raw_pwd, saltRounds);
      console.log('password generate --->', raw_pwd, hash_pwd);

      await execute('INSERT INTO users (username, pwd, persona_id, roll_id) VALUES (?, ?, ?, ?)', [
        persona.persona.cedula,
        hash_pwd,
        persona_id,
        1
      ])

    await execute('INSERT INTO empleados (persona_id, cargo, salario, fecha_inicio_contrato, empresa_id) VALUES (?, ?, ?, ?, ?)', [
        persona_id,
        "Gerente/Administrador",
        "0",
        "2023-01-01",
       emp_id
    ]);

      return {
        msg: 'Empresa registrada exitosamente',
        ok: true,
        status: 200
      };
    } catch (err) {
      return {
        ok: false,
        msg: 'Error inesperado del sistema, por favor contacte al administrador',
        error: err,
        status: 500,
      };
    }
  }

  @Get("/all")
  @Response<ConsultaEmpresasResponse>(200, "Consulta de Empresas", {
    ok: true,
    data: {},
    status: 200
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
  })
  @Response<NotFoundItems>(404, "No se encontraron empresas", {
    ok: false,
    msg: "No se encontraron empresas con los parametros compartidos",
    status: 404
  })
  public async consultarEmpresas(@Queries() querys: QuerysEmpresasFind): Promise<ConsultaEmpresasResponse | ValidateError | InternalServerError | NotFoundItems> {
    try {
      const {
        nombre,
        rnc
      } = querys;

      let query = `SELECT * FROM empresas
      WHERE 1 = 1`;

      if (rnc) {
        query += ` AND rnc = ${rnc}`;
      }

      if (nombre) {
        query += ` AND nombre_completo LIKE '%${nombre}%'`;
      }

      const findEmp = await execute(query);

      if(findEmp.length == 0) return {
        ok: false,
        msg: "No se encontraron empresas con los parametros compartidos",
        status: 404
      }

      return {
        ok: true,
        data: findEmp,
        status: 200
      }
    } catch (err) {
      return {
        ok: false,
        msg: 'Error inesperado del sistema, por favor contacte al administrador',
        error: err,
        status: 500,
      };
    }
  }

  @Put('/actualizar')
  @Response<ActualizarEmpresaResponse>(200, "Consulta de Empresas", {
    ok: true,
    msg: "Empresa actualizada correctamente",
    status: 200
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500
  })
  @Response<NotFoundItems>(404, "No se encontro la empresa", {
    ok: false,
    msg: "No se encontro la empresa con los parametros compartidos",
    status: 404
  })
  public async actualizarEmpresa(@Body() body: ActualizarEmpresa): Promise<ActualizarEmpresaResponse | ValidateError> {
    try {
      const {
        emp_id,
        nombre_completo,
        nombre_corto,
        rnc,
        website,
        persona,
        direccion,
        contactos,
      } = body;
  
      // Actualiza los datos de la empresa
      await execute('UPDATE empresas SET nombre_completo = ?, nombre_corto = ?, rnc = ?, website = ? WHERE emp_id = ?', [
        nombre_completo,
        nombre_corto,
        rnc,
        website,
        emp_id,
      ]);

      const direccionEmpResult = await execute('UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?', [
        direccion.provincia_id,
        direccion.municipio_id,
        direccion.direccion,
        direccion.codigo_postal,
        direccion.referencia,
        direccion.direccion_id
      ]);

      for (const contacto of contactos) {
        await execute('UPDATE contactos SET telefono = ?, movil = ?, telefono_oficina = ?, correo_electronico = ?, emp_id = ? WHERE contacto_id = ?', [
          contacto.telefono,
          contacto.movil,
          contacto.telefono_oficina,
          contacto.correo_electronico,
          emp_id,
          contacto.contacto_id
        ]);
      }
  
      // Obtiene el direccion_id actual de la persona
      const direccionPersonaResult = await execute('SELECT direccion_id FROM persona WHERE persona_id = ?', [persona.persona.persona_id]);
      const direccion_id_persona = direccionPersonaResult[0].direccion_id;
  
      // Actualiza la dirección de la persona
      await execute('UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?', [
        persona.direccion.provincia_id,
        persona.direccion.municipio_id,
        persona.direccion.direccion,
        persona.direccion.codigo_postal,
        persona.direccion.referencia,
        direccion_id_persona,
      ]);
  
      // Actualiza los datos de la persona
      await execute('UPDATE persona SET nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE persona_id = ?', [
        persona.persona.nombre,
        persona.persona.segundo_nombre,
        persona.persona.primer_apellido,
        persona.persona.segundo_apellido,
        persona.persona.fecha_nacimiento,
        persona.persona.sexo,
        persona.persona.estado,
        persona.persona.persona_id,
      ]);
  
      // Actualiza los contactos de la persona
      for (const contacto of persona.contactos) {
        await execute('UPDATE contactos SET telefono = ?, movil = ?, telefono_oficina = ?, correo_electronico = ? WHERE contacto_id = ?', [
          contacto.telefono,
          contacto.movil,
          contacto.telefono_oficina,
          contacto.correo_electronico,
          contacto.contacto_id,
        ]);
      }
  
      return {
        msg: 'Datos de la empresa actualizados exitosamente',
        ok: true,
        status: 200,
      };
    } catch (err) {  
      return {
        ok: false,
        msg: 'Error inesperado del sistema, por favor contacte al administrador',
        error: err,
        status: 500,
      };
    }
  }
  

}