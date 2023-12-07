export interface LoanType {
    nombre_tipo: string;
    descripcion: string;
    tasa_interes: number;
    plazo_maximo_meses: number;
    monto_minimo: number;
    monto_maximo: number;
    gastos_legales: number;
    porcentaje_mora: number;
    dias_gracia: number;
    requisitos: string[];
}

export interface UpdatedLoanType {
    nombre_tipo: string;
    descripcion: string;
    tasa_interes: string;
    plazo_maximo_meses: number;
    monto_minimo: number;
    monto_maximo: number;
    gastos_legales: number;
    porcentaje_mora: number
    dias_gracia: number;
    requisitos: string[];
    tipo_prestamo_id: number;
}