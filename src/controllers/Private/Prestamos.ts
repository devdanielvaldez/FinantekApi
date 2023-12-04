import { Body, Post, Route, Tags, Response, Get, Path, Put, Delete } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";

interface SuccessResponse {
    ok: boolean;
    msg: string;
    status: number;
  }

export default class PrestamoController {
    @Post("/prestamos/generar")
    public async generarPrestamo(
      @Body() datosPrestamo: {
        solicitud_id: number,
        frecuencia_pago: string,
        tipo_cuota: number,
        fecha_inicial: string // En formato 'YYYY-MM-DD'
      }
    ): Promise<InternalServerError | SuccessResponse | any> {
      try {
        const { solicitud_id, frecuencia_pago, tipo_cuota, fecha_inicial } = datosPrestamo;

        const solicitud = await execute(
          `SELECT * FROM solicitudes_prestamo WHERE solicitud_id = ? AND estado_solicitud = 'AP'`,
          [solicitud_id]
        );
  
        if (!solicitud || solicitud.length === 0) {
          return {
            ok: false,
            msg: "La solicitud de préstamo no está aprobada o no existe",
            status: 400,
          };
        }
  
        const tipoPrestamoId = solicitud[0].tipo_prestamo_id;
        const tipoPrestamo = await execute(
          `SELECT * FROM tipos_prestamos WHERE tipo_prestamo_id = ?`,
          [tipoPrestamoId]
        );
  
        if (!tipoPrestamo || tipoPrestamo.length === 0) {
          return {
            ok: false,
            msg: "El tipo de préstamo asociado a la solicitud no existe",
            status: 400,
          };
        }
  
        const montoAprobado = solicitud[0].monto_aprobado;
        const tasaInteres = tipoPrestamo[0].tasa_interes; // Suponiendo que el nombre del campo de tasa de interés es 'tasa_interes'
        const porcentajeCuotaCapital = 50; // Porcentaje de la cuota de capital

        const cuotaFijaCapital = (porcentajeCuotaCapital / 100) * montoAprobado;

        const insertPrestamoResult = await execute(
          `INSERT INTO prestamos 
          (solicitud_id, prestamo_monto_cuotas, prestamo_frecuencia, prestamo_tipo_cuota) 
          VALUES (?, ?, ?, ?)`,
          [solicitud_id, montoAprobado, frecuencia_pago, tipo_cuota]
        );

if (insertPrestamoResult.affectedRows > 0) {
    const prestamoId = insertPrestamoResult.insertId;
    const amortizaciones = []; // Almacenará las amortizaciones generadas
  
    // Convertir la fecha inicial proporcionada a un objeto de fecha
    const fechaInicio = new Date(fecha_inicial);
  
    // Función para calcular la siguiente fecha de pago basada en la frecuencia
    const calcularSiguienteFechaPago = (fecha: any, frecuencia: any) => {
      const frecuenciasDias: any = {
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
  
      const diasFrecuencia = frecuenciasDias[frecuencia];
      const siguienteFechaPago = new Date(fecha);
      siguienteFechaPago.setDate(siguienteFechaPago.getDate() + diasFrecuencia);
      return siguienteFechaPago;
    };
  
    // Lógica para generar las amortizaciones según la frecuencia y el tipo de cuota
    let fechaPago = fechaInicio;
    let saldoInsoluto = montoAprobado; // Se inicia con el monto aprobado
  
    while (saldoInsoluto > 0) {
        let cuotaCapital = 0;
        let cuotaInteres = 0;
        let cuotaSeguro = 0;
      
        if (tipo_cuota === 1) {
          // Cuota sobre saldo insoluto
          cuotaInteres = saldoInsoluto * tasaInteres;
          cuotaCapital = cuotaFijaCapital;
          cuotaSeguro = saldoInsoluto * 0.5;
        } else if (tipo_cuota === 2) {
          // Capital fijo más intereses variables
          cuotaCapital = cuotaFijaCapital;
          cuotaInteres = saldoInsoluto * tasaInteres;
          cuotaSeguro = saldoInsoluto * 0.5;
        } else if (tipo_cuota === 3) {
          // Capital e interés fijo sobre saldo insoluto
          const cuotaTotal = cuotaFijaCapital + (saldoInsoluto * tasaInteres);
          cuotaInteres = saldoInsoluto * tasaInteres;
          cuotaCapital = cuotaTotal - cuotaInteres;
          cuotaSeguro = saldoInsoluto * 0.5;
        } else if (tipo_cuota === 4) {
          // Capital al vencimiento del préstamo
          cuotaCapital = saldoInsoluto;
          cuotaInteres = saldoInsoluto * tasaInteres;
          cuotaSeguro = saldoInsoluto * 0.5;
        }
      
        // Insertar amortización en la base de datos
        const fechaPagoFormatoSQL = fechaPago.toISOString().split('T')[0];
        await execute(
          `INSERT INTO amortizaciones_prestamo 
          (prestamo_id, fecha_pago, cuota_capital, cuota_interes, cuota_seguro, saldo_insoluto) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [prestamoId, fechaPagoFormatoSQL, cuotaCapital, cuotaInteres, cuotaSeguro, saldoInsoluto]
        );
      
        // Guardar la amortización generada en la lista
        amortizaciones.push({
          fecha_pago: fechaPagoFormatoSQL,
          cuota_capital: cuotaCapital,
          cuota_interes: cuotaInteres,
          cuota_seguro: cuotaSeguro,
          saldo_insoluto: saldoInsoluto
        });
      
        // Calcular la siguiente fecha de pago
        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuencia_pago);
      
        // Actualizar el saldo insoluto para la próxima amortización
        saldoInsoluto -= cuotaCapital;
      }
      
  
    return {
      ok: true,
      msg: "Préstamo generado exitosamente",
      amortizaciones: amortizaciones, // Devolver las amortizaciones generadas (opcional)
      status: 200,
    };
  } else {
          return {
            ok: false,
            msg: "No se pudo generar el préstamo",
            status: 500,
          };
        }
      } catch (err) {
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
  