export interface Direccion {
    direccion_id?: number;
    provincia_id: number;     // int
    municipio_id: number;     // int
    direccion: string;        // varchar(150)
    codigo_postal?: string;    // varchar(6)
    referencia: string;       // varchar(150)
}
  