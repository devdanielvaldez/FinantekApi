export interface QuerysEmpresasFind {
    nombre?: string;
    rnc?: string;
}

export interface QuerysPersonasFind {
    nombre?: string;
    cedula?: string;
}

export interface QuerysPeopleByDNI {
    cedula?: string;
}