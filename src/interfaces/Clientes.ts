import { Conyuge } from "./Conyuge";
import { DatosBancarios } from "./DatosBancarios";
import { DatosLaborales } from "./DatosLaborales";
import { Persona, RegistrarPersona } from "./Persona";
import { Referencias } from "./Referencias";

export interface Cliente {
    cliente_id: number;
    conyuge_id: number;
    estado: "a" | "n" | "g" | "d" | "m";
    persona_id: number;
}

export interface RegistrarCliente {
    persona_id: number;
    datos_laborales: DatosLaborales[];
    datos_bancarios: DatosBancarios[];
    referencias: number[];
    conyuge_id: string;
    emp_id: number;
}

export interface UpdateClientBody {
    cliente_id: number;
    conyuge_id: number;
    datos_bancarios: DatosBancarios[];
    datos_laborales: DatosLaborales[];
    referencias: number[];
}

export interface UpdateClientState {
    cliente_id: number;
    nuevo_estado: "a" | "n" | "g" | "d" | "m";
}