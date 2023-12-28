import { execute } from "../utils/mysql.connector";
import cron from 'node-cron';

const registrarIncrementarAtraso = async (numeroPrestamo: number, numeroCuota: number) => {
    try {
      const queryExistente = 'SELECT dias_atraso FROM cuotas_retrasadas WHERE numero_prestamo = ? AND numero_cuota = ?';
      const resultado = await execute(queryExistente, [numeroPrestamo, numeroCuota]);
  
      if (resultado.length > 0) {
        // Incrementa los días de atraso en uno
        const diasAtrasoActualizados = resultado[0].dias_atraso + 1;
        const queryActualizar = 'UPDATE cuotas_retrasadas SET dias_atraso = ? WHERE numero_prestamo = ? AND numero_cuota = ?';
        await execute(queryActualizar, [diasAtrasoActualizados, numeroPrestamo, numeroCuota]);
      } else {
        // Inserta un nuevo registro con un día de atraso
        const queryInsertar = 'INSERT INTO cuotas_retrasadas (numero_prestamo, numero_cuota, dias_atraso) VALUES (?, ?, 1)';
        await execute(queryInsertar, [numeroPrestamo, numeroCuota]);
      }
    } catch (error) {
      console.error('Error al registrar o incrementar atraso:', error);
      throw error;
    }
  }

const eliminarCuotaPagada = async (numeroPrestamo: number, numeroCuota: number) => {
    try {
      const queryEstado = 'SELECT estado FROM amortizacion WHERE solicitudId = ? AND n_cuota = ?';
      const estadoCuota = await execute(queryEstado, [numeroPrestamo, numeroCuota]);
  
      if (estadoCuota.length > 0 && estadoCuota[0].estado === 'PA') {
        // Elimina la cuota de cuotas_retrasadas
        const queryEliminar = 'DELETE FROM cuotas_retrasadas WHERE numero_prestamo = ? AND numero_cuota = ?';
        await execute(queryEliminar, [numeroPrestamo, numeroCuota]);
      }
    } catch (error) {
      console.error('Error al eliminar cuota pagada:', error);
      throw error;
    }
  }
  
  export const cierreExecute = () => {
    console.log('iniciando cierre');
  }