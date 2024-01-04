export const frecuenciasDias = {
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

export const frecuenciasLiteral = ['DI', 'SM', 'CT', 'QU', 'ME', 'BM', 'TM', 'SEM', 'AN'];

export const codesPlantillas = [
    {
        code: 'ncuenta',
        descripcion: 'Número de cuenta'
    },
    {
        code: 'codBanco',
        descripcion: 'Código banco pertenece cuenta'
    },
    {
        code: 'tipoCuenta',
        descripcion: 'Tipo de Cuenta'
    },
    {
        code: 'nombreCliente',
        descripcion: 'Nombre del Cliente'
    },
    {
        code: 'tipoMovimiento',
        descripcion: 'Tipo de Movimiento'
    },
    {
        code: 'monto',
        descripcion: 'Monto'
    },
    {
        code: 'refTransaccion',
        descripcion: 'Referencia de Transacción'
    },
    {
        code: 'descTransaccion',
        descripcion: 'Descripción de Transaccion'
    },
    {
        code: 'correoBeneficiario',
        descripcion: 'Correo Beneficiario'
    }
];

export const PrecedenciaPagoCatalogo = [
    {
      label: 'Orden Original',
      valores: [
        'MORA',
        'INTERESES',
        'SEGURO',
        'CAPITAL'
      ],
    },
    {
      label: 'Cambio de Orden',
      valores: [
        'CAPITAL',
        'SEGURO',
        'INTERESES',
        'MORA'
      ],
    },
    {
      label: 'Enfoque en Capital e Intereses',
      valores: [
        'CAPITAL',
        'INTERESES',
        'MORA',
        'SEGURO'
      ],
    },
    {
      label: 'Mora Primero, Resto Después',
      valores: [
        'MORA',
        'CAPITAL',
        'INTERESES',
        'SEGURO'
      ],
    },
    {
      label: 'Enfoque en Seguro y Capital',
      valores: [
        'SEGURO', 
        'CAPITAL',
        'INTERESES',
        'MORA'
      ],
    },
];
  


export const PrecedenciaPago = {
    MORA: 'MORA',
    INTERESES: 'INTERESES',
    SEGURO: 'SEGURO',
    CAPITAL: 'CAPITAL',
  };
  
  export default class LogicaPrelacionPago {
    public aplicarPrelacionPago(deuda: any, montoRestante: any, prelacion: any) {
      for (const tipoPago of prelacion) {
        switch (tipoPago) {
          case PrecedenciaPago.MORA:
            if (deuda.prestamo_mora > 0) {
              const montoUsadoMora = Math.min(montoRestante, deuda.prestamo_mora);
              deuda.prestamo_mora -= montoUsadoMora;
              montoRestante -= montoUsadoMora;
            }
            break;
          case PrecedenciaPago.INTERESES:
            const montoUsadoIntereses = Math.min(montoRestante, deuda.prestamo_cuota_interes);
            deuda.prestamo_cuota_interes -= montoUsadoIntereses;
            montoRestante -= montoUsadoIntereses;
            break;
          case PrecedenciaPago.SEGURO:
            const montoUsadoSeguro = Math.min(montoRestante, deuda.prestamo_cuota_seguro);
            deuda.prestamo_cuota_seguro -= montoUsadoSeguro;
            montoRestante -= montoUsadoSeguro;
            break;
          case PrecedenciaPago.CAPITAL:
            const montoUsadoCapital = Math.min(montoRestante, deuda.prestamo_cuota_capital);
            deuda.prestamo_cuota_capital -= montoUsadoCapital;
            montoRestante -= montoUsadoCapital;
            break;
          default:
            break;
        }
      }
      return deuda; // Devuelve la deuda actualizada
    }
  }