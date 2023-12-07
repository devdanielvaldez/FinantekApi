const moment = require('moment');

function calcularSiguienteFechaPago(fechaActual, dias) {
    if (!moment(fechaActual).isValid()) {
        throw new Error("Fecha actual no es válida");
    }
    if (typeof dias !== 'number' || dias <= 0) {
        throw new Error("Cantidad de días no es válida");
    }

    const nuevaFecha = moment(fechaActual).add(dias, 'days');
    return nuevaFecha.format('YYYY-MM-DD');
}

function amortizacionCuotaSobreSaldoInsoluto(fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, frecuenciasDias) {
    let fechaPago = new Date(fecha_inicial);
    let saldoInsoluto = monto_aprobado;
    const amortizaciones = [];

    while (saldoInsoluto > 0) {
        const cuotaInteres = saldoInsoluto * tasa_interes / 100;
        const cuotaCapital = (monto_aprobado / frecuenciasDias[frecuencia_pago]);
        saldoInsoluto -= cuotaCapital;

        amortizaciones.push({ fecha_pago: fechaPago, cuotaCapital, cuotaInteres, saldoInsoluto });
        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuenciasDias[frecuencia_pago]);
    }

    return amortizaciones;
}

function amortizacionCapitalFijoInteresesVariables(fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, frecuenciasDias) {
    let fechaPago = new Date(fecha_inicial);
    let saldoInsoluto = monto_aprobado;
    const amortizaciones = [];

    while (saldoInsoluto > 0) {
        const cuotaCapital = (monto_aprobado / frecuenciasDias[frecuencia_pago]);
        const cuotaInteres = saldoInsoluto * tasa_interes / 100;
        saldoInsoluto -= cuotaCapital;

        amortizaciones.push({ fecha_pago: fechaPago, cuotaCapital, cuotaInteres, saldoInsoluto });
        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuenciasDias[frecuencia_pago]);
    }

    return amortizaciones;
}

function amortizacionCapitalInteresFijo(fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, frecuenciasDias) {
    let fechaPago = new Date(fecha_inicial);
    let saldoInsoluto = monto_aprobado;
    const amortizaciones = [];

    while (saldoInsoluto > 0) {
        const cuotaInteres = saldoInsoluto * tasa_interes / 100;
        const cuotaTotal = (monto_aprobado / frecuenciasDias[frecuencia_pago]);
        const cuotaCapital = cuotaTotal - cuotaInteres;
        saldoInsoluto -= cuotaCapital;

        amortizaciones.push({ fecha_pago: fechaPago, cuotaCapital, cuotaInteres, saldoInsoluto });
        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuenciasDias[frecuencia_pago]);
    }

    return amortizaciones;
}

function amortizacionCapitalVencimiento(fecha_inicial, monto_aprobado, tasa_interes, frecuencia_pago, frecuenciasDias) {
    let fechaPago = new Date(fecha_inicial);
    let saldoInsoluto = monto_aprobado;
    const amortizaciones = [];

    while (saldoInsoluto > 0) {
        const cuotaInteres = saldoInsoluto * tasa_interes / 100;
        const cuotaCapital = (saldoInsoluto === monto_aprobado) ? 0 : saldoInsoluto;
        saldoInsoluto -= cuotaCapital;

        amortizaciones.push({ fecha_pago: fechaPago, cuotaCapital, cuotaInteres, saldoInsoluto });
        fechaPago = calcularSiguienteFechaPago(fechaPago, frecuenciasDias[frecuencia_pago]);
    }

    return amortizaciones;
}


module.exports = {
    amortizacionCapitalVencimiento,
    amortizacionCapitalInteresFijo,
    amortizacionCapitalFijoInteresesVariables,
    amortizacionCuotaSobreSaldoInsoluto
}