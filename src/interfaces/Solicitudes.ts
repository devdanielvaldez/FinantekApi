export interface LoanRequestDocument {
    nombre: string;
    enlace: string;
  }
  
export interface LoanRequest {
    cliente_id: number;
    tipo_prestamo_id: number;
    monto_solicitado: number;
    documentos: LoanRequestDocument[]; 
    frecuencia: string; // Lista de documentos
    plazo: number;
    fecha_inicio: string;
  }

  export interface UpdateLoanRequest {
    cliente_id: number;
    tipo_prestamo_id: number;
    monto_solicitado: number;
  }