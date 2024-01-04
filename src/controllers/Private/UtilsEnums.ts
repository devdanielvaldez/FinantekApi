import { Body, Get, Header, Path, Post, Route, Tags } from "tsoa";
import { execute } from "../../api/utils/mysql.connector"
import { PrecedenciaPagoCatalogo, codesPlantillas, frecuenciasLiteral } from "../../api/utils/utils";
import { s3, uploadToS3 } from "./UploadFiles";

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

    @Get('/tipos-prestamos')
    public async tiposPrestamos() {

    }

    @Get('/tipos-frecuencias')
    public async tiposFrecuencias(
        @Header() token?: any
    ) {
        try {
            return {
                ok: true,
                status: 200,
                data: frecuenciasLiteral
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

    @Get('/codes')
    public async codesPlantillas(
        @Header() token?: any
    ) {
        try {
            return {
                ok: true,
                status: 200,
                data: codesPlantillas
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

    @Get('/prelacion')
    public async prelacionEnums(
        @Header() token?: any
    ) {
        try {
            return {
                ok: true,
                status: 200,
                data: PrecedenciaPagoCatalogo
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

    @Post('/files')
    public async uploadFiles(@Body() files: any, @Header() token?:any) {
        try {
            console.log(files.file);
            const uplaodRes = await uploadToS3(s3, files.file);

            if (uplaodRes.success) {
                return uplaodRes;
              } else {
                return uplaodRes;
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