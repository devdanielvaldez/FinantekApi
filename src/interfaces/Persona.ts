import { ContactosRegistro } from "./Contactos";
import { DireccionRegistro } from "./Direccion";

export interface Persona {
    persona_id?: number;          // int AI PK
    nombre: string;              // varchar(50)
    segundo_nombre?: string;      // varchar(50)
    primer_apellido: string;     // varchar(50)
    segundo_apellido?: string;    // varchar(50)
    fecha_nacimiento: string;    // date
    sexo: string;                // char(1)
    estado?: string;              // char(1)
    direccion_id?: number;        // int
    cedula: string;
}

export interface PersonaRegistro {
    nombre: string;              // varchar(50)
    segundo_nombre?: string;      // varchar(50)
    primer_apellido: string;     // varchar(50)
    segundo_apellido?: string;    // varchar(50)
    fecha_nacimiento: string;    // date
    sexo: string;                // char(1)
    cedula: string;
}

export interface RegistrarPersona {
    persona: PersonaRegistro;
    contactos: ContactosRegistro[];
    direccion: DireccionRegistro;
}