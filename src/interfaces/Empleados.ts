import { Contactos } from "./Contactos";
import { Direccion } from "./Direccion";
import { Persona } from "./Persona";

export interface Empleado {
    empleado_id: number;
    persona_id: number;
    cargo: string;
    salario: number;
    fecha_inicio_contrato: string; // Puedes cambiar el tipo de dato si es necesario
    supervisor_id: number | null; // El supervisor_id puede ser nulo si no tiene supervisor
    fecha_creacion: string; // Puedes cambiar el tipo de dato si es necesario
    fecha_actualizacion: string; // Puedes cambiar el tipo de dato si es necesario
    empresa_id: number;
}

export interface RegisterEmpleado {
    persona: Persona;
    empleado: Empleado;
    contactos: Contactos[];
    direccion: Direccion;
    rol: number;
}