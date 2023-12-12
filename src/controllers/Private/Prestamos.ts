import { generarPlanPrestamo } from './../../api/utils/prestamos';
import { Body, Post, Route, Tags, Response, Get, Path, Put, Delete, Header } from "tsoa";
import { execute } from "../../api/utils/mysql.connector";
import { InternalServerError, NotFoundItems } from "../../interfaces/Errors";
import { generarNumeroPrestamo } from '../../api/utils/helpers';

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
    @Post("/generar-amortizacion")
    public async generarAmortizacionPrestamo(
      @Body() datosPrestamo: {
        fecha_inicial: any;
        monto_aprobado: number;
        tasa_interes: number;
        cuota_seguro: number;
        frecuencia_pago: string;
        numeroDeMeses: number;
        solicitudId: number;
      },
      @Header() token: any
    ): Promise<InternalServerError | SuccessResponse | any> {
      // const empId = token.dataUsuario.emp_id.empresa_id;
      // console.log(empId);
      try {
        const empId = token.dataUsuario.emp_id.empresa_id;
        console.log(empId);
        const {
          fecha_inicial,
          monto_aprobado,
          tasa_interes,
          frecuencia_pago,
          cuota_seguro,
            numeroDeMeses,
            solicitudId
        } = datosPrestamo;

        const loan = generarPlanPrestamo(fecha_inicial,
          +monto_aprobado,
          +tasa_interes,
          +cuota_seguro,
          frecuencia_pago,
          +numeroDeMeses,
          frecuenciasDias);

          var n_cuota = 1;

          for(const l of loan) {
            await execute(`INSERT INTO amortizacion (
              solicitudId,
              fecha_pago, 
              cuotaCapital, 
              cuotaInteres, 
              cuotaSeguro, 
              montoPendientePrestamo, 
              montoTotalAPagar, 
              estado,
              n_cuota,
              emp_id
          ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          );
          `, [
            solicitudId,
            l.fecha_pago,
            l.cuotaCapital,
            l.cuotaInteres,
            l.cuotaSeguro,
            l.montoPendientePrestamo,
            l.montoTotalAPagar,
            'PE',
            n_cuota++,
            empId
          ]);
          }

            return {
              ok: true,
              msg: "Amortizacion generada correctamente",
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

    @Post('/generar-prestamo')
    public async crearYRegistrarPrestamo(
      @Body() datosPrestamo: {
        fecha_inicial: string;
        monto_aprobado: number;
        tasa_interes: number;
        cuota_seguro: number;
        frecuencia_pago: string;
        numeroDeMeses: number;
        solicitud_id: number;
      },
      @Header() token: any
    ): Promise<any> {
      try {
        const empId = token.dataUsuario.emp_id.empresa_id;
        const {
          fecha_inicial,
          monto_aprobado,
          tasa_interes,
          frecuencia_pago,
          cuota_seguro,
          numeroDeMeses,
          solicitud_id
        } = datosPrestamo;
    
        // Aquí asumimos que generarPlanPrestamo es una función que calcula los detalles del préstamo
        const planPrestamo = generarPlanPrestamo(fecha_inicial, monto_aprobado, tasa_interes, cuota_seguro, frecuencia_pago, numeroDeMeses, frecuenciasDias);
    
        const cantidad_cuotas = planPrestamo.length;
        const cuota_actual = 1; // Comienza en la primera cuota
        const prestamo_fecha_pago = planPrestamo[0].fecha_pago; // Fecha de pago de la primera cuota
        const fecha_final = planPrestamo[planPrestamo.length - 1].fecha_pago; // Fecha de pago de la última cuota
        const prestamo_monto_cuotas = planPrestamo[0].montoTotalAPagar; // Monto de la cuota total (incluyendo seguro)
        const prestamo_fecha_ultimo_cierre = new Date().toISOString().split('T')[0]; // Fecha actual como último cierre
        const prestamo_balance_actual = monto_aprobado; // El balance inicial es el monto aprobado
        const prestamo_cuota_capital = planPrestamo[0].cuotaCapital;
        const prestamo_cuota_interes = planPrestamo[0].cuotaInteres;
        const prestamo_frecuencia = datosPrestamo.frecuencia_pago;
        const prestamo_mora = 0; // Inicialmente, no hay mora

        const queryObtener = 'SELECT ultimo_numero FROM secuencia_prestamo WHERE id = 1';
        const resultado = await execute(queryObtener);
        const ultimoNumero = resultado[0].ultimo_numero;
  
        // Incrementar el número para el nuevo préstamo
        const nuevoNumero = ultimoNumero + 1;
  
        // Actualizar el último número en la base de datos
        const queryActualizar = 'UPDATE secuencia_prestamo SET ultimo_numero = ? WHERE id = 1';
        await execute(queryActualizar, [nuevoNumero]);

        // Construir la consulta SQL para insertar el nuevo préstamo en la base de datos
        const insertQuery = `
          INSERT INTO prestamos (solicitud_id, cantidad_cuotas, cuota_actual, numero_prestamo, prestamo_fecha_pago, fecha_inicio, fecha_final, prestamo_monto_cuotas, prestamo_fecha_ultimo_cierre, prestamo_balance_actual, prestamo_cuota_capital, prestamo_cuota_interes, prestamo_cuota_seguro, prestamo_frecuencia, prestamo_mora, prestamo_tipo_cuota, n_cuota, emp_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        // Valores a insertar (deberás calcular o definir estos valores según tu lógica de negocio)
        const values = [
          solicitud_id,
          cantidad_cuotas,
          cuota_actual,
          nuevoNumero,
          prestamo_fecha_pago,
          fecha_inicial,
          fecha_final,
          prestamo_monto_cuotas,
          prestamo_fecha_ultimo_cierre,
          prestamo_balance_actual,
          prestamo_cuota_capital,
          prestamo_cuota_interes,
          cuota_seguro,
          prestamo_frecuencia,
          prestamo_mora,
          '1',
          1,
          empId
        ];

        console.log(values);
    
        // Ejecutar la consulta
        await execute(insertQuery, values);
    
        return {
          ok: true,
          msg: "Préstamo creado y registrado con éxito",
          status: 200
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          msg: "Error interno del sistema al registrar el préstamo",
          error: err,
          status: 500,
        };
      }
    }
    
    @Post('/pagar-cuota')
    public async pagarCuota() {
      
    }
  
    // ...otros métodos...
  }
  