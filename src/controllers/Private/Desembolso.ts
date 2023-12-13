import { Get, Header, Post, Response, Route, Tags } from "tsoa";

@Route('api/solicitudes-desembolsar')
@Tags('Solicitudes a Desembolsar')
export default class DesembolsoController {
    @Get('all')
    public async getAllDesembolso(@Header() token: any):Promise<any> {
        try {
            const empId = token.dataUsuario.emp_id.empresa_id;

            const solicitudes_a_desembolsar = [
                {
                    no_solicitud: 1,
                    cliente: {
                        cliente_id: 1,
                        nombre: "Daniel Abner",
                        apellido: "Valdez Guzman",
                        cedula: "40211111110",
                    },
                    prestamo: {
                        monto_aprobado: 23481,
                    },
                    banco: {
                        codigo_banco: "BHD",
                        numero_cuenta: "2917491031"
                    },
                    estado: "PE_DE"
                },
                {
                    no_solicitud: 2,
                    cliente: {
                        cliente_id: 2,
                        nombre: "Noelia Alexandra",
                        apellido: "Rivera Fabian",
                        cedula: "40201234510",
                    },
                    prestamo: {
                        monto_aprobado: 3481,
                    },
                    banco: {
                        codigo_banco: "BRD",
                        numero_cuenta: "1239418243"
                    },
                    estado: "PE_DE"
                },
                {
                    no_solicitud: 3,
                    cliente: {
                        cliente_id: 3,
                        nombre: "Brandon",
                        apellido: "Long Jones",
                        cedula: "402396658908"
                    },
                    prestamo: {
                        monto_aprobado: 23523
                    },
                    banco: {
                        codigo_banco: "BPD",
                        numero_cuenta: "9909774956"
                    },
                    estado: "PE_DE"
                },
                {
                    no_solicitud: 4,
                    cliente: {
                        cliente_id: 4,
                        nombre: "Cynthia",
                        apellido: "Estrada Wood",
                        cedula: "402726236483"
                    },
                    prestamo: {
                        monto_aprobado: 47585
                    },
                    banco: {
                        codigo_banco: "BPD",
                        numero_cuenta: "2749259423"
                    },
                    estado: "PE_DE"
                },
                {
                    no_solicitud: 5,
                    cliente: {
                        cliente_id: 5,
                        nombre: "Andrew",
                        apellido: "Waters Johnson",
                        cedula: "402437017521"
                    },
                    prestamo: {
                        monto_aprobado: 14544
                    },
                    banco: {
                        codigo_banco: "BRD",
                        numero_cuenta: "0447918513"
                    },
                    estado: "PE_DE"
                }
            ];

            return {
                ok: true,
                status: 200,
                data: solicitudes_a_desembolsar
            }
        } catch(err) {
            return {
                ok: false,
                msg: "Error interno del sistema, por favor contacte al administrador",
                error: err,
                status: 500
            }
        }
    }

    @Post('/desembolsar-por-cliente')
    public async desembolsarPorCliente() {}
}