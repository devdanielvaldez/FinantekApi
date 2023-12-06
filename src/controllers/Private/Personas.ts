import {
  Body,
  Get,
  Post,
  Queries,
  Response,
  Route,
  Tags,
} from "tsoa";
import { RegistrarPersona, Persona as PersonaInterface } from "../../interfaces/Persona";
import { InternalServerError, NotFoundItems, ValidateError } from "../../interfaces/Errors";
import { execute } from "../../api/utils/mysql.connector";
import { QuerysPersonasFind } from "../../interfaces/Querys";
import { Direccion } from "../../interfaces/Direccion";
import { Contactos } from "../../interfaces/Contactos";

interface RegistrarPersonaResponse {
  msg: string;
  ok: boolean;
  status: number;
  error?: any;
}

interface ConsultarPersonasResponse {
  ok: boolean;
  data: any;
  status: number;
}

interface CreatedPersonaResponse {
  msg: string;
  ok: boolean;
  status: number;
}

interface ActualizarPersonaResponse {
    msg: string;
    ok: boolean;
    status: number;
}

interface ActualizarPersonaBody {
    personaId: number,
    persona: PersonaInterface,
    direccion: Direccion,
    contactos: Contactos[]
}

@Route("api/personas")
@Tags("Personas")
export default class Persona {
  @Post("/registrar")
  @Response<CreatedPersonaResponse>(200, "Persona registrada", {
    msg: "La persona ha sido registrada correctamente",
    ok: true,
    status: 200,
  })
  @Response<ValidateError>(400, "Persona Existe", {
    message: "La persona que desea registrar ya se encuentra en el sistema",
    status: 400,
    name: "ErrorExistPer",
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  public async registrarPersona(
    @Body() body: RegistrarPersona
  ): Promise<RegistrarPersonaResponse | InternalServerError> {
    try {
      const { persona, contactos, direccion } = body;

      const existPersona = await execute(
        "SELECT persona_id FROM persona WHERE cedula = ?",
        [persona.cedula]
      );

      if (existPersona.length > 0) {
        // La persona ya existe, realizar el UPDATE en lugar de la inserción
        const personaId = existPersona[0].persona_id;

        // Actualizar la dirección
        await execute(
          "UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?",
          [
            direccion.provincia_id,
            direccion.municipio_id,
            direccion.direccion,
            direccion.codigo_postal,
            direccion.referencia,
            personaId,
          ]
        );

        // Actualizar los datos de la persona
        await execute(
          "UPDATE persona SET nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE persona_id = ?",
          [
            persona.nombre,
            persona.segundo_nombre,
            persona.primer_apellido,
            persona.segundo_apellido,
            persona.fecha_nacimiento,
            persona.sexo,
            persona.estado,
            personaId,
          ]
        );

        // Eliminar los contactos existentes de la persona
        await execute("DELETE FROM contactos WHERE persona_id = ?", [
          personaId,
        ]);

        // Insertar los nuevos contactos de la persona
        for (const c of contactos) {
          await execute(
            "INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)",
            [
              c.telefono,
              c.movil,
              c.telefono_oficina,
              c.correo_electronico,
              personaId,
            ]
          );
        }

        return {
          ok: true,
          msg: "Persona actualizada correctamente",
          status: 200,
        };
      } else {
        // La persona no existe, realizar la inserción
        const direccionInsert = await execute(
          "INSERT INTO direcciones (provincia_id, municipio_id, direccion, codigo_postal, referencia) VALUES (?, ?, ?, ?, ?)",
          [
            direccion.provincia_id,
            direccion.municipio_id,
            direccion.direccion,
            direccion.codigo_postal,
            direccion.referencia,
          ]
        );

        const personaInsert = await execute(
          "INSERT INTO persona (nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, sexo, estado, direccion_id, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            persona.nombre,
            persona.segundo_nombre,
            persona.primer_apellido,
            persona.segundo_apellido,
            persona.fecha_nacimiento,
            persona.sexo,
            persona.estado,
            direccionInsert.insertId,
            persona.cedula,
          ]
        );

        for (const c of contactos) {
          await execute(
            "INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)",
            [
              c.telefono,
              c.movil,
              c.telefono_oficina,
              c.correo_electronico,
              personaInsert.insertId,
            ]
          );
        }

        return {
          ok: true,
          msg: "Persona registrada correctamente",
          status: 200,
        };
      }
    } catch (err) {
      return {
        ok: false,
        msg: "Error inesperado del sistema, por favor contacte al administrador",
        error: err,
        status: 500,
      };
    }
  }

  @Post("/actualizar")
  @Response<CreatedPersonaResponse>(200, "Persona registrada", {
    msg: "La persona ha sido registrada correctamente",
    ok: true,
    status: 200,
  })
  @Response<ValidateError>(400, "Persona no Existe", {
    message: "La persona que desea registrar no se encuentra en el sistema",
    status: 400,
    name: "ErrorExistPer",
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  public async actualizarPersonaExistente(
    @Body() body: ActualizarPersonaBody
  ): Promise<ActualizarPersonaResponse | InternalServerError> {
    try {
      await execute(
        "UPDATE direcciones SET provincia_id = ?, municipio_id = ?, direccion = ?, codigo_postal = ?, referencia = ? WHERE direccion_id = ?",
        [
          body.direccion.provincia_id,
          body.direccion.municipio_id,
          body.direccion.direccion,
          body.direccion.codigo_postal,
          body.direccion.referencia,
          body.personaId,
        ]
      );

      await execute(
        "UPDATE persona SET nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, fecha_nacimiento = ?, sexo = ?, estado = ? WHERE persona_id = ?",
        [
          body.persona.nombre,
          body.persona.segundo_nombre,
          body.persona.primer_apellido,
          body.persona.segundo_apellido,
          body.persona.fecha_nacimiento,
          body.persona.sexo,
          body.persona.estado,
          body.personaId,
        ]
      );

      await execute("DELETE FROM contactos WHERE persona_id = ?", [body.personaId]);

      for (const c of body.contactos) {
        await execute(
          "INSERT INTO contactos (telefono, movil, telefono_oficina, correo_electronico, persona_id) VALUES (?, ?, ?, ?, ?)",
          [
            c.telefono,
            c.movil,
            c.telefono_oficina,
            c.correo_electronico,
            body.personaId,
          ]
        );
      }

      return {
        ok: true,
        msg: "Persona actualizada correctamente",
        status: 200,
      };
    } catch (err) {
        console.log(err);
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/all")
  @Response<ConsultarPersonasResponse>(
    200,
    "Consulta de personas satisfactoria",
    {
      ok: true,
      data: [],
      status: 200,
    }
  )
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<NotFoundItems>(404, "No se encontraron personas", {
    ok: false,
    msg: "No se encontraron personas con los parametros compartidos",
    status: 404,
  })
  public async getPersonas(
    @Queries() querys: QuerysPersonasFind
  ): Promise<ConsultarPersonasResponse | InternalServerError | NotFoundItems> {
    try {
      const { nombre, cedula } = querys;

      let query = `SELECT 
            * FROM persona WHERE 1 = 1;`;

      if (cedula) {
        query += ` AND cedula = ${cedula}`;
      }

      if (nombre) {
        query += ` AND nombre LIKE '%${nombre}%'`;
      }

      const findPer = await execute(query);

      if (findPer.length == 0)
        return {
          ok: false,
          msg: "No se encontraron personas con los parametros compartidos",
          status: 404,
        };

      let data: any = [];

      for (const p of findPer) {
        await data.push({
          persona_id: p.persona_id,
          nombre: p.nombre,
          segundo_nombre: p.segundo_nombre,
          primer_apellido: p.primer_apellido,
          segundo_apellido: p.segundo_apellido,
          fecha_nacimiento: p.fecha_nacimiento,
          sexo: p.sexo,
          estado: p.estado,
          cedula: p.cedula,
        });
      }

      return {
        ok: true,
        data: data,
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/persona-por-id/{id}")
  @Response<ConsultarPersonasResponse>(
    200,
    "Consulta de persona satisfactoria",
    {
      ok: true,
      data: [],
      status: 200,
    }
  )
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<NotFoundItems>(404, "No se encontro la persona", {
    ok: false,
    msg: "No se encontro la persona con los parametros compartidos",
    status: 404,
  })
  public async getPersonaById(
    id: number
  ): Promise<ConsultarPersonasResponse | NotFoundItems | InternalServerError> {
    try {
      let query = `SELECT 
            p.persona_id,
            p.nombre,
            p.segundo_nombre,
            p.primer_apellido,
            p.segundo_apellido,
            p.fecha_nacimiento,
            p.sexo,
            p.estado,
            d.direccion_id,
            d.provincia_id,
            d.municipio_id,
            d.direccion,
            d.codigo_postal,
            d.referencia,
            c.contacto_id,
            c.telefono,
            c.movil,
            c.telefono_oficina,
            c.correo_electronico
            FROM persona p
            LEFT JOIN direcciones d ON p.direccion_id = d.direccion_id
            LEFT JOIN contactos c ON p.persona_id = c.persona_id WHERE p.persona_id = ${id};`;

      const existPers = await execute(query);

      if (existPers.length == 0)
        return {
          ok: false,
          msg: "No se encontro la persona con los parametros compartidos",
          status: 404,
        };

      let data: any = {
        persona_id: existPers[0].persona_id,
        nombre: existPers[0].nombre,
        segundo_nombre: existPers[0].segundo_nombre,
        primer_apellido: existPers[0].primer_apellido,
        segundo_apellido: existPers[0].segundo_apellido,
        fecha_nacimiento: existPers[0].fecha_nacimiento,
        sexo: existPers[0].sexo,
        estado: existPers[0].estado,
        contacto: [],
        direccion: {
          direccion_id: existPers[0].direccion_id,
          provincia_id: existPers[0].provincia_id,
          municipio_id: existPers[0].municipio_id,
          direccion: existPers[0].direccion,
          codigo_postal: existPers[0].codigo_postal,
          referencia: existPers[0].referencia,
        },
      };

      for (const c of existPers) {
        data.contacto.push({
          contacto_id: c.contacto_id,
          telefono: c.telefono,
          movil: c.movil,
          telefono_oficina: c.telefono_oficina,
          correo_electronico: c.correo_electronico,
        });
      }

      return {
        ok: true,
        data: data,
        status: 200,
      };
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: err,
        status: 500,
      };
    }
  }
}
