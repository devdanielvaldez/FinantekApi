import { Contactos } from "./Contactos";
import { Direccion } from "./Direccion";
import { Persona } from "./Persona";

export interface RegistrarEmpresa {
    nombre_completo: string;
    nombre_corto?: string;
    rnc: string;
    website?: string;
    persona: PersonaEmpresa;
    direccion: Direccion;
    contactos: Contactos[];
}

interface PersonaEmpresa {
    persona: Persona;
    direccion: Direccion;
    contactos: Contactos[];
}

export interface ActualizarEmpresa {
    emp_id?: number;
    nombre_completo: string;
    nombre_corto?: string;
    rnc: string;
    website?: string;
    persona: PersonaEmpresa;
    direccion: Direccion;
    contactos: Contactos[];
}