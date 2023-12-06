export interface Contactos {
    contacto_id?: number;         // int AI PK
    telefono?: string;            // varchar(11)
    movil?: string;               // varchar(11)
    telefono_oficina?: string;    // varchar(11)
    correo_electronico?: string;  // varchar(11)
    persona_id?: number;          // int
    emp_id?: number;              // int
  }

  export interface ContactosRegistro {
    telefono?: string;            // varchar(11)
    movil?: string;               // varchar(11)
    telefono_oficina?: string;    // varchar(11)
    correo_electronico?: string;  // varchar(11)
  }
  