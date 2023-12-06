import { Conyuge } from "./Conyuge";
import { DatosBancarios, DatosBancariosRegister } from "./DatosBancarios";
import { DatosLaborales, DatosLaboralesRegister } from "./DatosLaborales";
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
    datos_laborales: DatosLaboralesRegister[];
    datos_bancarios: DatosBancariosRegister[];
    referencias: number[];
    conyuge_id: number;
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