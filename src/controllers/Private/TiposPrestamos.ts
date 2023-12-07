import { Body, Get, Post, Put, Route, Tags, Path, Response, Header } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";
import { LoanType, UpdatedLoanType } from "../../interfaces/TiposPrestamos";

interface SuccessResponseRegisterLoanType {
  ok: boolean;
  msg: string;
  status: number;
}

interface SuccessResponseFindLoanTypes {
  ok: boolean;
  data: any[];
  status: number;
}

interface SuccessResponseUpdateLoanType {
  ok: boolean;
  msg: string;
  status: number;
}

@Route("/api/tipos-prestamos")
@Tags("Tipos de Préstamos")
export default class LoanTypes {
  @Post("/registrar")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseRegisterLoanType>(
    200,
    "Registro satisfactorio de tipo de préstamo",
    {
      ok: true,
      msg: "Tipo de préstamo registrado correctamente",
      status: 200,
    }
  )
  public async registerLoanType(
    @Body() body: LoanType,
    @Header() token: any
  ): Promise<InternalServerError | SuccessResponseRegisterLoanType> {
    try {
      const empId = token.dataUsuario.emp_id.empresa_id
      const {
        nombre_tipo,
        descripcion,
        tasa_interes,
        plazo_maximo_meses,
        monto_minimo,
        monto_maximo,
        gastos_legales,
        porcentaje_mora,
        dias_gracia,
        requisitos
      } = body;
  
      // Realizar la inserción en la base de datos con la información proporcionada
      const insertResult = await execute(
        `INSERT INTO tipos_prestamos 
        (nombre_tipo, descripcion, tasa_interes, plazo_maximo_meses, monto_minimo, monto_maximo, gastos_legales, porcentaje_mora, dias_gracia, requisitos, empresa_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombre_tipo,
          descripcion,
          tasa_interes,
          plazo_maximo_meses,
          monto_minimo,
          monto_maximo,
          gastos_legales,
          porcentaje_mora,
          dias_gracia,
          requisitos,
          empId
        ]
      );
  
      // Verificar si la inserción fue exitosa
      if (insertResult && insertResult.insertId) {
        return {
          ok: true,
          msg: "Tipo de préstamo registrado correctamente",
          status: 200,
        };
      } else {
        // Si no se pudo insertar el tipo de préstamo, devolver un error
        return {
          ok: false,
          msg: "No se pudo registrar el tipo de préstamo",
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

  @Get("/por-empresa")
  @Response<SuccessResponseFindLoanTypes>(
    200,
    "Consulta satisfactoria de tipos de préstamos por empresa",
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
  @Response<NotFoundItems>(404, "Not Found Items", {
    ok: false,
    msg: "No se encontraron tipos de préstamos para esta empresa",
    status: 404
  })
  public async getLoanTypesByCompany(
    @Header() token: any
  ): Promise<SuccessResponseFindLoanTypes | InternalServerError | NotFoundItems> {
    try {
      // Lógica para obtener todos los tipos de préstamos asociados a una empresa específica según el 'empresa_id'
      const loanTypes = await execute("SELECT * FROM tipos_prestamos WHERE empresa_id = ?", [
        token.dataUsuario.emp_id.empresa_id,
      ]);
  
      if (loanTypes && loanTypes.length > 0) {
        return {
          ok: true,
          data: loanTypes,
          status: 200,
        };
      } else {
        return {
          ok: false,
          msg: "No se encontraron tipos de préstamos para esta empresa",
          status: 404,
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
  

  @Put("/actualizar")
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<SuccessResponseUpdateLoanType>(
    200,
    "Actualización satisfactoria del tipo de préstamo",
    {
      ok: true,
      msg: "Tipo de préstamo actualizado correctamente",
      status: 200,
    }
  )
  public async updateLoanType(
    @Body() body: UpdatedLoanType, @Header() token: any
  ): Promise<InternalServerError | SuccessResponseUpdateLoanType> {
    try {
      const {
        tipo_prestamo_id,
        nombre_tipo,
        descripcion,
        tasa_interes,
        plazo_maximo_meses,
        monto_minimo,
        monto_maximo,
        gastos_legales,
        porcentaje_mora,
        dias_gracia,
        requisitos
      } = body;
  
      // Lógica para actualizar un tipo de préstamo existente en la base de datos
      const updateResult = await execute(
        `UPDATE tipos_prestamos 
         SET nombre_tipo = ?, descripcion = ?, tasa_interes = ?, plazo_maximo_meses = ?, 
             monto_minimo = ?, monto_maximo = ?, gastos_legales = ?, porcentaje_mora = ?, 
             dias_gracia = ?, requisitos = ?
         WHERE tipo_prestamo_id = ?`,
        [
          nombre_tipo,
          descripcion,
          tasa_interes,
          plazo_maximo_meses,
          monto_minimo,
          monto_maximo,
          gastos_legales,
          porcentaje_mora,
          dias_gracia,
          requisitos,
          tipo_prestamo_id
        ]
      );
  
      // Verificar si la actualización fue exitosa
      if (updateResult && updateResult.affectedRows > 0) {
        return {
          ok: true,
          msg: "Tipo de préstamo actualizado correctamente",
          status: 200,
        };
      } else {
        // Si no se pudo actualizar el tipo de préstamo, devolver un error
        return {
          ok: false,
          msg: "No se pudo actualizar el tipo de préstamo",
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
  
}
