import { generarPlanPrestamo } from './../../api/utils/prestamos';
import { Body, Post, Route, Tags, Response, Get, Path, Put, Delete } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";

const frecuenciasDias = {
  DI: 1,
  SM: 7,
  CT: 14,
  QU: 15,
  ME: 30,
  BM: 60,
  TM: 90,
  SEM: 180,
  AN: 360
};

interface SuccessResponse {
    ok: boolean;
    msg: string;
    status: number;
    data: any;
  }
  @Route("/api/prestamos")
  @Tags("Prestamos")
export default class PrestamoController {
    @Post("/generar")
    public async generarPrestamo(
      @Body() datosPrestamo: {
        fecha_inicial: any;
        monto_aprobado: any;
        tasa_interes: any;
        cuota_seguro: number;
        frecuencia_pago: any;
        numeroDeMeses: any
      }
    ): Promise<InternalServerError | SuccessResponse | any> {
      try {
        const {
          fecha_inicial,
          monto_aprobado,
          tasa_interes,
          frecuencia_pago,
          cuota_seguro,
            numeroDeMeses
        } = datosPrestamo;

        const loan = generarPlanPrestamo(fecha_inicial,
          +monto_aprobado,
          +tasa_interes,
          +cuota_seguro,
          frecuencia_pago,
          +numeroDeMeses,
          frecuenciasDias);

          console.log(loan);

            return {
              ok: true,
              msg: "Success",
              status: 200,
              data: loan
            };
      } catch (err) {
          console.log(err);
        return {
          ok: false,
          msg: "Error interno del sistema al generar el préstamo",
          error: err,
          status: 500,
        };
      }
    }
  
    // ...otros métodos...
  }
  