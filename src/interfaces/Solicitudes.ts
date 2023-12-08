export interface LoanRequestDocument {
    nombre: string;
    enlace: string;
  }
  
export interface LoanRequest {
    cliente_id: number;
    tipo_prestamo_id: number;
    empresa_id: number;
    monto_solicitado: number;
    documentos: LoanRequestDocument[]; // Lista de documentos
  }