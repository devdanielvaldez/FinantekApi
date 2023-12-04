import { Contactos } from "./Contactos";
import { Direccion } from "./Direccion";

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

export interface RegistrarPersona {
    persona: Persona;
    contactos: Contactos[];
    direccion: Direccion;
}