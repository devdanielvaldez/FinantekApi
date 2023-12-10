import { Get, Header, Path, Route, Tags } from "tsoa";
import { execute } from "../../api/utils/mysql.connector"

@Route('/api/utils')
@Tags('Utils')
export default class UtilsEnumsController {
    @Get('/provincias')
    public async getProvincias(@Header() token: any):Promise<any> {
        try {
            const provincias = await execute('SELECT * FROM provincias');

            return {
                ok: true,
                status: 200,
                data: provincias
            }
        } catch(err) {
            return {
                ok: false,
                status: 500,
                msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                error: err
            }
        }
    }

    @Get('/municipios/:id')
    public async getMunicipios(@Header() token: any, @Path() id: any):Promise<any> {
        try {
            const municipios = await execute('SELECT * FROM municipios WHERE provincia_id = ?', [id]);

            return {
                ok: true,
                status: 200,
                data: municipios
            }
        } catch(err) {
            return {
                ok: false,
                status: 500,
                msg: "Error interno del sistema, por favor contacte al administrador del sistema",
                error: err
            }
        }
    }
}