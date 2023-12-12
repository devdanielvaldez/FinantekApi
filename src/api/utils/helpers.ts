import crypto from 'crypto';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { execute } from './mysql.connector';

export const generatePassword = () => {
  // Definir el tamaño del password en bytes (8 caracteres * 2 bytes por caracter hexadecimal)
  const tamañoPassword = 8;

  // Generar bytes aleatorios de forma segura
  const bytesAleatorios = crypto.randomBytes(tamañoPassword);

  // Convertir los bytes en una cadena hexadecimal
  const password = bytesAleatorios.toString('hex').slice(0, tamañoPassword);

  return password;
}

export const hashPassword = async (password: string) => {
    const saltRounds = 10; // Número de rondas de sal (más rondas, más seguro pero más lento)
  
    // Generar el hash del password
    const hash = await bcrypt.hash(password, saltRounds);
  
    return hash;
}

export const verifyPassword = async(hashPassword: string, textPlainPassword: string) => {
  const passValidation = await bcrypt.compare(textPlainPassword, hashPassword);

  return passValidation;
}

export const formatDate = (date: any, format: string) => {
  switch(format) {
    case 'n':
      return moment(date).locale('es-Do').format('L');
    case 's':
      return moment(date).locale('es-Do').format('lll');
  }
}

export const generarPlanPrestamo = (fechaInicial: any, montoAprobado: any, tasaInteresAnual: any, cuotaSeguro: any, frecuenciaPago: any, numeroDeMeses: any) => {
  const tasaInteresMensual = tasaInteresAnual / 12 / 100;
  let saldo = montoAprobado;
  let fecha = new Date(fechaInicial);
  let planPrestamo = [];

  // Calcular la cuota mensual (sin incluir seguro)
  const cuotaMensual = montoAprobado * tasaInteresMensual / (1 - Math.pow(1 + tasaInteresMensual, -numeroDeMeses));

  for (let i = 0; i < numeroDeMeses; i++) {
      const interes = saldo * tasaInteresMensual;
      const capital = cuotaMensual - interes;
      saldo -= capital;

      // Añadir la cuota de seguro a la cuota total
      const cuotaTotal = cuotaMensual + cuotaSeguro;

      planPrestamo.push({
          cuota: i + 1,
          fechaPago: fecha.toISOString().split('T')[0], // Formato de fecha YYYY-MM-DD
          capital: capital,
          interes: interes,
          cuotaTotal: cuotaTotal,
          saldoRestante: saldo
      });

      // Incrementar la fecha al próximo período de pago
      fecha.setMonth(fecha.getMonth() + 1);
  }

  return planPrestamo;
}

export const generarNumeroPrestamo = async() => {
  try {
      // Obtener el último número de préstamo de la base de datos
      const queryObtener = 'SELECT ultimo_numero FROM secuencia_prestamo WHERE id = 1';
      const resultado = await execute(queryObtener);
      const ultimoNumero = resultado[0].ultimo_numero;

      // Incrementar el número para el nuevo préstamo
      const nuevoNumero = ultimoNumero + 1;

      // Actualizar el último número en la base de datos
      const queryActualizar = 'UPDATE secuencia_prestamo SET ultimo_numero = ? WHERE id = 1';
      await execute(queryActualizar, [nuevoNumero]);

      // Devolver el nuevo número de préstamo
      return nuevoNumero;
  } catch (error) {
      console.error('Error al generar el número de préstamo:', error);
      throw error;
  }
}
