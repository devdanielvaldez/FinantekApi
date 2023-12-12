import { Body, Get, Head, Header, Path, Post, Put, Request, Res, Response, Route, Security, Tags } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import {
  RegistrarCliente,
  UpdateClientBody,
  UpdateClientState,
} from "../../interfaces/Clientes";
import { InternalServerError } from "../../interfaces/Errors";

interface SuccessResponseRegisterClient {
  ok: boolean;
  msg: string;
  status: number;
}

interface SuccessResponseFindClients {
  ok: boolean;
  data: any;
  status: number;
}

interface SuccessResponseUpdateClient {
  ok: boolean;
  msg: string;
  status: number;
}

interface SuccessResponseUpdateClientStatus {
  ok: boolean;
  msg: string;
  status: number;
}

@Route("/api/clientes")
@Tags("Clientes")
export default class Clientes {
  @Post("/registrar")
  @Security('token')
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseRegisterClient>(
    200,
    "Registro satisfactorio de cliente",
    {
      ok: true,
      msg: "Cliente registrado correctamente",
      status: 200,
    }
  )
  public async registerClients(
    @Body() body: RegistrarCliente,
    @Header() token: any,
  ): Promise<InternalServerError | SuccessResponseRegisterClient> {
    try {
      const {
        conyuge_id,
        datos_bancarios,
        datos_laborales,
        persona_id,
        referencias,
      } = body;

      const insertConyuge = await execute(
        "INSERT INTO conyuge (persona_id) VALUES (?)",
        [conyuge_id]
      );

      const insertClient = await execute(
        "INSERT INTO clientes (conyuge_id, estado, persona_id, emp_id) VALUES (?, ?, ?, ?)",
        [insertConyuge.insertId, "a", persona_id, token.dataUsuario.emp_id.empresa_id]
      );

      // insert data banks
      for (const db of datos_bancarios) {
        await execute(
          "INSERT INTO datos_bancarios (banco_codigo_id, n_cuenta, cuenta_default, cliente_id) VALUES (?, ?, ?, ?)",
          [
            db.banco_codigo_id,
            db.n_cuenta,
            db.cuenta_default,
            insertClient.insertId,
          ]
        );
      }

      // insert datos laborales
      for (const dl of datos_laborales) {
        await execute(
          "INSERT INTO datos_laborales (dlabNombreEmpresa, dlabDepartamento, dlabPosicion, dlabHorarioEntrada, dlabHorarioSalida, dlabNombreSupervisor, dlabIdProvincia, dlabIdMunicipio, dlabCalle, cliente_id, salario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            dl.dlabNombreEmpresa,
            dl.dlabDepartamento,
            dl.dlabPosicion,
            dl.dlabHorarioEntrada,
            dl.dlabHorarioSalida,
            dl.dlabNombreSupervisor,
            dl.dlabIdProvincia,
            dl.dlabIdMunicipio,
            dl.dlabCalle,
            insertClient.insertId,
            dl.salario,
          ]
        );
      }

      // insert referencias
      for (const rf of referencias) {
        await execute(
          "INSERT INTO referencias (persona_id, cliente_id) VALUES (?, ?)",
          [rf, insertClient.insertId]
        );
      }

      return {
        ok: true,
        msg: "Cliente registrado correctamente",
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

  @Put("/actualizar")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseUpdateClient>(
    200,
    "Actualización satisfactoria del cliente",
    {
      ok: true,
      msg: "Cliente actualizado correctamente",
      status: 200,
    }
  )
  public async updateClient(
    @Body() body: UpdateClientBody,
    @Header() token: any
  ): Promise<InternalServerError | SuccessResponseUpdateClient> {
    try {
      const {
        cliente_id,
        conyuge_id,
        datos_bancarios,
        datos_laborales,
        referencias,
      } = body;

      // Update conyuge_id if necessary
      if (conyuge_id) {
        await execute(
          "UPDATE clientes SET conyuge_id = ? WHERE cliente_id = ?",
          [conyuge_id, cliente_id]
        );
      }

      // Update datos bancarios
      for (const db of datos_bancarios) {
        await execute(
          "UPDATE datos_bancarios SET banco_codigo_id = ?, n_cuenta = ?, cuenta_default = ? WHERE cliente_id = ? AND banco_id = ?",
          [
            db.banco_codigo_id,
            db.n_cuenta,
            db.cuenta_default,
            cliente_id,
            db.datos_bancarios_id, // Assuming there's a unique identifier for each bank account
          ]
        );
      }

      // Update datos laborales
      for (const dl of datos_laborales) {
        await execute(
          "UPDATE datos_laborales SET dlabNombreEmpresa = ?, dlabDepartamento = ?, dlabPosicion = ?, dlabHorarioEntrada = ?, dlabHorarioSalida = ?, dlabNombreSupervisor = ?, dlabIdProvincia = ?, dlabIdMunicipio = ?, dlabCalle = ?, salario = ? WHERE cliente_id = ? AND dlab_id = ?",
          [
            dl.dlabNombreEmpresa,
            dl.dlabDepartamento,
            dl.dlabPosicion,
            dl.dlabHorarioEntrada,
            dl.dlabHorarioSalida,
            dl.dlabNombreSupervisor,
            dl.dlabIdProvincia,
            dl.dlabIdMunicipio,
            dl.dlabCalle,
            dl.salario,
            cliente_id,
            dl.dlab_id, // Assuming there's a unique identifier for each labor data entry
          ]
        );
      }

      // Update referencias (assuming a replacement of all references)
      await execute("DELETE FROM referencias WHERE cliente_id = ?", [
        cliente_id,
      ]);

      for (const rf of referencias) {
        await execute(
          "INSERT INTO referencias (persona_id, cliente_id) VALUES (?, ?)",
          [rf, cliente_id]
        );
      }

      return {
        ok: true,
        msg: "Cliente actualizado correctamente",
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

  @Get("/all")
  @Response<SuccessResponseFindClients>(
    200,
    "Consulta satisfactoria de clientes",
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
  public async getAllClients(
   @Header() token: any
  ): Promise<SuccessResponseFindClients | InternalServerError> {
    try {
      const findClientsByEmp = await execute(
        `
        SELECT
        c.cliente_id,
        c.estado,
        p.*,
        dl.*,
        db.*,
        ct.*,
        dr.*,
        cy.*,
        cp.*
    FROM
        clientes c
    LEFT JOIN
        persona p ON c.persona_id = p.persona_id
    LEFT JOIN
        datos_laborales dl ON c.cliente_id = dl.cliente_id
    LEFT JOIN
        datos_bancarios db ON c.cliente_id = db.cliente_id
    LEFT JOIN
        contactos ct ON p.persona_id = ct.persona_id
    LEFT JOIN
        direcciones dr ON p.direccion_id = dr.direccion_id
    LEFT JOIN
        conyuge cy ON c.conyuge_id = cy.conyuge_id
    LEFT JOIN
        persona cp ON cy.persona_id = cp.persona_id
    WHERE
        c.emp_id = ?;
    `,
        [token.dataUsuario.emp_id.empresa_id]
      );

      return {
        ok: true,
        data: findClientsByEmp,
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

  @Put("/actualizar-estado-cliente")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseUpdateClientStatus>(
    200,
    "Actualización satisfactoria del estado del cliente",
    {
      ok: true,
      msg: "Estado del cliente actualizado correctamente",
      status: 200,
    }
  )
  public async updateClientStatus(
    @Body() body: UpdateClientState
  ): Promise<InternalServerError | SuccessResponseUpdateClientStatus> {
    try {
      const { cliente_id, nuevo_estado } = body;

      // Verificar si el nuevo estado es uno de los valores permitidos ("a", "n", "g", "d", "m")
      const estadosPermitidos = ["a", "n", "g", "d", "m"];
      if (!estadosPermitidos.includes(nuevo_estado)) {
        return {
          ok: false,
          msg: "El estado proporcionado no es válido",
          status: 400,
        };
      }

      await execute("UPDATE clientes SET estado = ? WHERE cliente_id = ?", [
        nuevo_estado,
        cliente_id,
      ]);

      return {
        ok: true,
        msg: "Estado del cliente actualizado correctamente",
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

  @Get("/:id")
  @Response<SuccessResponseFindClients>(
    200,
    "Consulta satisfactoria de clientes",
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
  public async getClientById(
   @Header() token: any,
   @Path() id: number
  ): Promise<SuccessResponseFindClients | InternalServerError> {
    try {
      const findClientsByEmp = await execute(
        `
        SELECT
        c.cliente_id,
        c.estado,
        p.*,
        dl.*,
        db.*,
        ct.*,
        dr.*,
        cy.*,
        cp.*
    FROM
        clientes c
    LEFT JOIN
        persona p ON c.persona_id = p.persona_id
    LEFT JOIN
        datos_laborales dl ON c.cliente_id = dl.cliente_id
    LEFT JOIN
        datos_bancarios db ON c.cliente_id = db.cliente_id
    LEFT JOIN
        contactos ct ON p.persona_id = ct.persona_id
    LEFT JOIN
        direcciones dr ON p.direccion_id = dr.direccion_id
    LEFT JOIN
        conyuge cy ON c.conyuge_id = cy.conyuge_id
    LEFT JOIN
        persona cp ON cy.persona_id = cp.persona_id
    WHERE
        c.cliente_id = ?;
    `,
        [id]
      );

      return {
        ok: true,
        data: findClientsByEmp,
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
