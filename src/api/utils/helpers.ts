import crypto from 'crypto';
import bcrypt from 'bcrypt';
import moment from 'moment';

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