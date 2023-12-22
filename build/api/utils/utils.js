"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codesPlantillas = exports.frecuenciasLiteral = exports.frecuenciasDias = void 0;
exports.frecuenciasDias = {
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
exports.frecuenciasLiteral = ['DI', 'SM', 'CT', 'QU', 'ME', 'BM', 'TM', 'SEM', 'AN'];
exports.codesPlantillas = [
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
