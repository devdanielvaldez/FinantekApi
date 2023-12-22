import { Body, Get, Header, Post, Response, Route, Tags } from "tsoa";
import { LoanRequest } from "../../interfaces/Solicitudes";
import { InternalServerError } from "../../interfaces/Errors";
import { execute } from "../../api/utils/mysql.connector";

@Route('api/solicitudes-desembolsar')
@Tags('Solicitudes a Desembolsar')
export default class DesembolsoController {
    @Get('all')
    public async getAllDesembolso(@Header() token: any
    ): Promise<InternalServerError | LoanRequest[] | any> {
      try {
        const empId = token.dataUsuario.emp_id.empresa_id;
        const loanRequests = await execute(`
        SELECT 
          sp.*, 
          db.*, 
          b.*,
          c.*,
          p.*,
          co.*
        FROM 
          solicitudes_prestamo sp
        INNER JOIN 
          datos_bancarios db ON sp.cliente_id = db.cliente_id
        INNER JOIN 
          bancos b ON db.banco_codigo_id = b.banco_id
        INNER JOIN
            clientes c ON c.cliente_id = sp.cliente_id
        INNER JOIN
            persona p ON p.persona_id = c.persona_id
        INNER JOIN
            contactos co ON co.persona_id = p.persona_id
        WHERE 
          sp.empresa_id = ? AND 
          sp.estado_solicitud = ? AND 
          db.cuenta_default = 1
      `, [empId, 'PE_DE']);
      
          
        return {
          ok: true,
          data: loanRequests,
          status: 200
        };
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
    public async desembolsarPorCliente(@Body() data: any, @Header() token: any) {
        const placeholders = data.ids.map((_: any, index: any) => '?').join(', ');

        // La consulta SQL
        const query = `UPDATE solicitudes_prestamo SET estado_solicitud = 'AP_DE' WHERE solicitud_id IN (${placeholders})`;
    
        // Ejecutar la consulta
        try {
            await execute(query, data.ids);
            console.log('Estado de solicitud actualizado con éxito.');

            return {
                ok: true,
                msg: "Prestamos desembolsados corractamente",
                status: 200
            }
        } catch (error) {
            console.error('Error al actualizar el estado de solicitud:', error);
            return {
                ok: false,
                msg: "Error interno del sistema, por favor contacte al administrador",
                error: error,
                status: 500
            }
        }
    }
}