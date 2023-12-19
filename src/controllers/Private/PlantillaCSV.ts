import { Body, Post, Route, Tags, Response, Get, Path, Put, Delete, Header } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";
import { PlantillaCSV } from "../../interfaces/PlantillasCSV";

interface SuccessResponse {
    ok: boolean;
    msg: string;
    status: number;
  }
  
  @Route("/api/plantillas")
  @Tags("Plantillas CSV")
export default class PlantillaCSVController {
    @Post("/plantillas-csv")
    public async crearPlantillaCSV(
      @Body() nuevaPlantilla: {
        banco_id: number,
        titulo_plantilla: string,
        campos: Array<{ titulo_campo: string, identificador_campo: string }>
      },
      @Header() token: any
    ): Promise<InternalServerError | SuccessResponse> {
      try {
        const empId = token.dataUsuario.emp_id.empresa_id;
        const { banco_id, titulo_plantilla, campos } = nuevaPlantilla;
  
        // Crear la plantilla
        const insertPlantillaResult = await execute(
          `INSERT INTO plantillas_csv 
          (banco_id, empresa_id, titulo_plantilla) 
          VALUES (?, ?, ?)`,
          [banco_id, empId, titulo_plantilla]
        );
  
        if (insertPlantillaResult.affectedRows <= 0) {
          return {
            ok: false,
            msg: "No se pudo crear la plantilla CSV",
            status: 500,
          };
        }
  
        const plantillaId = insertPlantillaResult.insertId;
  
        // Insertar los campos asociados a la plantilla
        for (const campo of campos) {
          await execute(
            `INSERT INTO campos_plantilla_csv 
            (plantilla_id, titulo_campo, identificador_campo) 
            VALUES (?, ?, ?)`,
            [plantillaId, campo.titulo_campo, campo.identificador_campo]
          );
        }
  
        return {
          ok: true,
          msg: "Plantilla CSV creada correctamente",
          status: 200,
        };
      } catch (err) {
        return {
          ok: false,
          msg: "Error interno del sistema al crear la plantilla CSV",
          error: err,
          status: 500,
        };
      }
    }
  
    @Delete("/plantillas-csv/:plantilla_id")
  public async eliminarPlantillaCSV(
    @Path() plantilla_id: number
  ): Promise<InternalServerError | SuccessResponse> {
    try {
      // Eliminar los campos asociados a la plantilla
      await execute(
        `DELETE FROM campos_plantilla_csv WHERE plantilla_id = ?`,
        [plantilla_id]
      );

      // Eliminar la plantilla
      const deleteResult = await execute(
        `DELETE FROM plantillas_csv WHERE plantilla_id = ?`,
        [plantilla_id]
      );

      if (deleteResult.affectedRows > 0) {
        return {
          ok: true,
          msg: "Plantilla CSV y campos asociados eliminados correctamente",
          status: 200,
        };
      } else {
        return {
          ok: false,
          msg: "No se pudo eliminar la plantilla CSV o la plantilla no existe",
          status: 500,
        };
      }
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema al eliminar la plantilla CSV",
        error: err,
        status: 500,
      };
    }
  }

  @Put("/plantillas-csv/:plantilla_id")
  public async actualizarPlantillaCSV(
    @Path() plantilla_id: number,
    @Body() datosActualizados: {
      titulo_plantilla: string,
      campos: Array<{ campo_id: number, titulo_campo: string, identificador_campo: string }>
    }
  ): Promise<InternalServerError | SuccessResponse> {
    try {
      const { titulo_plantilla, campos } = datosActualizados;

      // Actualizar la información de la plantilla
      const updatePlantillaResult = await execute(
        `UPDATE plantillas_csv 
        SET titulo_plantilla = ? 
        WHERE plantilla_id = ?`,
        [titulo_plantilla, plantilla_id]
      );

      if (updatePlantillaResult.affectedRows <= 0) {
        return {
          ok: false,
          msg: "No se pudo actualizar la plantilla CSV o la plantilla no existe",
          status: 500,
        };
      }

      // Actualizar los campos asociados a la plantilla
      for (const campo of campos) {
        await execute(
          `UPDATE campos_plantilla_csv 
          SET titulo_campo = ?, identificador_campo = ? 
          WHERE campo_id = ? AND plantilla_id = ?`,
          [campo.titulo_campo, campo.identificador_campo, campo.campo_id, plantilla_id]
        );
      }

      return {
        ok: true,
        msg: "Plantilla CSV actualizada correctamente",
        status: 200,
      };
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema al actualizar la plantilla CSV",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/plantillas-csv/:plantilla_id")
  public async obtenerPlantillaCSV(
    @Path() plantilla_id: number
  ): Promise<InternalServerError | PlantillaCSV | NotFoundItems> {
    try {
      const plantilla = await execute(
        `SELECT * FROM plantillas_csv WHERE plantilla_id = ?`,
        [plantilla_id]
      );

      if (!plantilla || plantilla.length === 0) {
        return {
          ok: false,
          msg: "No se encontró la plantilla CSV",
          status: 404,
        };
      }

      const campos = await execute(
        `SELECT * FROM campos_plantilla_csv WHERE plantilla_id = ?`,
        [plantilla_id]
      );

      const plantillaConCampos = {
        ...plantilla[0],
        campos,
      };

      return plantillaConCampos;
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema al obtener la plantilla CSV",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/plantillas-csv/")
  public async obtenerTodasPlantillasEmpresa(
    @Header() token: any
  ): Promise<InternalServerError | any> {
    try {
      const empId = token.dataUsuario.emp_id.empresa_id;
      const plantillas = await execute(
        `SELECT * FROM plantillas_csv WHERE empresa_id = ?`,
        [empId]
      );

      const plantillasConCampos: PlantillaCSV[] = [];

      for (const plantilla of plantillas) {
        const campos = await execute(
          `SELECT * FROM campos_plantilla_csv WHERE plantilla_id = ?`,
          [plantilla.plantilla_id]
        );

        const plantillaConCampos: PlantillaCSV = {
          ...plantilla,
          campos,
        };

        plantillasConCampos.push(plantillaConCampos);
      }

      return {
        ok: true,
        data: plantillasConCampos,
        status: 200,
        msg: "Plantillas recuperadas corractamente"
      };
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema al obtener las plantillas de la empresa",
        error: err,
        status: 500,
      };
    }
  }

  }
  