export interface PlantillaCSV {
    plantilla_id: number;
    banco_id: number;
    empresa_id: number;
    titulo_plantilla: string;
    campos: CampoPlantillaCSV[];
  }
  
export interface CampoPlantillaCSV {
    campo_id: number;
    plantilla_id: number;
    titulo_campo: string;
    identificador_campo: string;
  }
  