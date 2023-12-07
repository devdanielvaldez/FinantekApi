import { Body, Post, Route, Tags, Response, Get, Path, Put, Delete, Header } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError } from "../../interfaces/Errors";
import { LoanRequest } from "../../interfaces/Solicitudes";

interface SuccessResponseCreateLoanRequest {
  ok: boolean;
  msg: string;
  status: number;
}

interface SuccessResponse {
  ok: boolean;
  msg: string;
  status: number;
}

@Route("/api/solicitudes-prestamo")
@Tags("Solicitudes de Préstamo")
export default class LoanRequests {
  @Post("/registrar")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseCreateLoanRequest>(
    200,
    "Creación satisfactoria de solicitud de préstamo",
    {
      ok: true,
      msg: "Solicitud de préstamo creada correctamente",
      status: 200,
    }
  )
  public async createLoanRequest(
    @Body() body: LoanRequest
  ): Promise<InternalServerError | SuccessResponseCreateLoanRequest> {
    try {
      const {
        cliente_id,
        tipo_prestamo_id,
        empresa_id,
        monto_solicitado,
        emp_id,
        documentos // Lista de documentos
      } = body;

      // Al crear la solicitud, el estado automáticamente queda como "PE" (pendiente)
      const insertResult = await execute(
        `INSERT INTO solicitudes_prestamo 
        (cliente_id, tipo_prestamo_id, empresa_id, monto_solicitado, estado_solicitud, emp_id) 
        VALUES (?, ?, ?, ?, 'PE', ?)`,
        [
          cliente_id,
          tipo_prestamo_id,
          empresa_id,
          monto_solicitado,
          emp_id
        ]
      );

      // Verificar si la inserción fue exitosa
      if (insertResult && insertResult.insertId) {
        // Obtener el ID de la solicitud recién creada
        const solicitudId = insertResult.insertId;

        // Insertar los documentos asociados a la solicitud en la tabla de documentos
        for (const documento of documentos) {
          await execute(
            `INSERT INTO documentos_solicitud 
            (solicitud_id, nombre, enlace) 
            VALUES (?, ?, ?)`,
            [
              solicitudId,
              documento.nombre,
              documento.enlace
            ]
          );
        }

        return {
          ok: true,
          msg: "Solicitud de préstamo creada correctamente",
          status: 200,
        };
      } else {
        // Si no se pudo crear la solicitud, devolver un error
        return {
          ok: false,
          msg: "No se pudo crear la solicitud de préstamo",
          status: 500,
        };
      }
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/solicitudes")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<any>(200, "Success", {
    ok: true,
    data: [],
    status: 200
  })
public async getAllLoanRequestsByCompany(
  @Header() token: any
): Promise<InternalServerError | LoanRequest[] | any> {
  try {
    const empId = token.dataUsuario.emp_id.empresa_id;
    const loanRequests = await execute(
      `SELECT * FROM solicitudes_prestamo WHERE empresa_id = ?`,
      [empId]
    );
    return loanRequests;
  } catch (err) {
    return {
      ok: false,
      msg: "Error interno del sistema al obtener las solicitudes por empresa",
      error: err,
      status: 500,
    };
  }
}

@Get("/solicitudes/:empresa_id/:id")
@Response<any>(200, "Success", {
  ok: true,
  data: {},
  status: 200
})
@Response<InternalServerError>(500, "Internal Server Error", {
  ok: false,
  msg: "Error interno del sistema, por favor contacte al administrador del sistema",
  error: {},
  status: 500,
})
public async getLoanRequestByIdAndCompany(
  @Path() empresa_id: number,
  @Path() id: number
): Promise<InternalServerError | LoanRequest> {
  try {
    const loanRequest = await execute(
      `SELECT * FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`,
      [id, empresa_id]
    );
    return loanRequest;
  } catch (err) {
    return {
      ok: false,
      msg: "Error interno del sistema al obtener la solicitud por empresa",
      error: err,
      status: 500,
    };
  }
}


@Put("/solicitudes/:empresa_id/:id/editar")
@Response<any>(200, "Success", {
  ok: true,
  data: {},
  status: 200
})
@Response<InternalServerError>(500, "Internal Server Error", {
  ok: false,
  msg: "Error interno del sistema, por favor contacte al administrador del sistema",
  error: {},
  status: 500,
})
public async updateLoanRequest(
  @Path() empresa_id: number,
  @Path() id: number,
  @Body() updatedData: Partial<LoanRequest>
): Promise<InternalServerError | SuccessResponse | any> {
  try {
    const { cliente_id, tipo_prestamo_id, monto_solicitado, emp_id } = updatedData;

    const updateResult = await execute(
      `UPDATE solicitudes_prestamo 
      SET cliente_id = ?, tipo_prestamo_id = ?, monto_solicitado = ?, emp_id = ? 
      WHERE solicitud_id = ? AND empresa_id = ?`,
      [cliente_id, tipo_prestamo_id, monto_solicitado, emp_id, id, empresa_id]
    );

    if (updateResult.affectedRows > 0) {
      return {
        ok: true,
        msg: "Solicitud de préstamo actualizada correctamente",
        status: 200,
      };
    } else {
      return {
        ok: false,
        msg: "No se pudo actualizar la solicitud de préstamo o la solicitud no existe para esa empresa",
        status: 500,
      };
    }
  } catch (err) {
    return {
      ok: false,
      msg: "Error interno del sistema al actualizar la solicitud por empresa",
      error: err,
      status: 500,
    };
  }
}

@Delete("/solicitudes/:empresa_id/:id/eliminar")
@Response<any>(200, "Success", {
  ok: true,
  data: {},
  status: 200
})
@Response<InternalServerError>(500, "Internal Server Error", {
  ok: false,
  msg: "Error interno del sistema, por favor contacte al administrador del sistema",
  error: {},
  status: 500,
})
public async deleteLoanRequest(
  @Path() empresa_id: number,
  @Path() id: number
): Promise<InternalServerError | SuccessResponse | any> {
  try {
    const deleteResult = await execute(
      `DELETE FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`,
      [id, empresa_id]
    );

    if (deleteResult.affectedRows > 0) {
      return {
        ok: true,
        msg: "Solicitud de préstamo eliminada correctamente",
        status: 200,
      };
    } else {
      return {
        ok: false,
        msg: "No se pudo eliminar la solicitud de préstamo o la solicitud no existe para esa empresa",
        status: 500,
      };
    }
  } catch (err) {
    return {
      ok: false,
      msg: "Error interno del sistema al eliminar la solicitud por empresa",
      error: err,
      status: 500,
    };
  }
}


@Put("/solicitudes/:empresa_id/:solicitud_id/actualizar-estado")
public async updateLoanRequestStatus(
  @Path() empresa_id: number,
  @Path() solicitud_id: number,
  @Body() newStatusData: { nuevo_estado: string, mensaje: string, empleado_id: number }
): Promise<InternalServerError | SuccessResponse> {
  try {
    const { nuevo_estado, mensaje, empleado_id } = newStatusData;

    // Obtener el estado actual de la solicitud
    const currentStatusQuery = await execute(
      `SELECT estado_solicitud FROM solicitudes_prestamo WHERE solicitud_id = ? AND empresa_id = ?`,
      [solicitud_id, empresa_id]
    );

    if (!currentStatusQuery || currentStatusQuery.length === 0) {
      return {
        ok: false,
        msg: "No se encontró la solicitud de préstamo para esa empresa",
        status: 404,
      };
    }

    const estado_anterior = currentStatusQuery[0].estado_solicitud;

    // Actualizar el estado de la solicitud
    const updateResult = await execute(
      `UPDATE solicitudes_prestamo 
      SET estado_solicitud = ? 
      WHERE solicitud_id = ? AND empresa_id = ?`,
      [nuevo_estado, solicitud_id, empresa_id]
    );

    if (updateResult.affectedRows > 0) {
      // Registrar el cambio en la tabla mensajes_estado_solicitud
      await execute(
        `INSERT INTO mensajes_estado_solicitud 
        (solicitud_id, estado_anterior, estado_nuevo, mensaje, empleado_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [solicitud_id, estado_anterior, nuevo_estado, mensaje, empleado_id]
      );

      return {
        ok: true,
        msg: "Estado de la solicitud de préstamo actualizado correctamente",
        status: 200,
      };
    } else {
      return {
        ok: false,
        msg: "No se pudo actualizar el estado de la solicitud de préstamo",
        status: 500,
      };
    }
  } catch (err) {
    return {
      ok: false,
      msg: "Error interno del sistema al actualizar el estado de la solicitud",
      error: err,
      status: 500,
    };
  }
}



}
