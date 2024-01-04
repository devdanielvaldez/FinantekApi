import { Post, Body, Response, Route, Tags, Path, Get, Header } from "tsoa"; // Importa tus decoradores
import { execute } from "../../api/utils/mysql.connector";
import { NotFoundItems } from "../../interfaces/Errors";

interface RolData {
  nombre: string;
  pantallasAsociadas: any; // Array de IDs de pantallas asociadas
  horarioInicio: string; // Hora de inicio de acceso al rol (formato: 'HH:mm:ss')
  horarioFin: string; // Hora de fin de acceso al rol (formato: 'HH:mm:ss')
}

interface RolResponse {
  ok: boolean;
  msg: string;
  status?: number;
  error?: any;
}

interface InternalServerError {
  ok: boolean;
  msg: string;
  status: number;
  error: any;
}

@Route("/api/roles")
@Tags("Roles")
export default class RolController {
  @Post("/registrar")
  @Response<RolResponse>(200, "Rol registrado", {
    ok: true,
    msg: "Rol registrado exitosamente",
    status: 200,
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema, por favor contacte al administrador del sistema",
    error: {},
    status: 500,
  })
  @Response<any>(400, "Error al registrar el rol", {
    ok: false,
    msg: "Error al registrar el rol",
  })
  public async registrarRol(
    @Body() rolData: RolData
  ): Promise<RolResponse | InternalServerError | any> {
    try {
      const { nombre, pantallasAsociadas, horarioInicio, horarioFin } = rolData;
      console.log(rolData);

      // Paso 1: Crear un nuevo rol
      const insertRolQuery = `INSERT INTO roles (nombre) VALUES (?)`;
      const result = await execute(insertRolQuery, [nombre]);
      const nuevoRolId = result.insertId;

      // Paso 2: Asociar pantallas al nuevo rol
      const insertPantallasQuery = `INSERT INTO acceso_rol_pantalla (rol_id, pantalla_id) VALUES (?, ?)`;
      const pantallasValores = [];
      console.log(pantallasAsociadas);
      for (let i = 0; i < pantallasAsociadas.length; i++) {
        const pantallaId = pantallasAsociadas[i];
            await execute(insertPantallasQuery, [nuevoRolId, pantallasAsociadas[i]]);
      }

      // Paso 3: Agregar horario de acceso para el nuevo rol
      const insertHorarioQuery = `INSERT INTO horario_acceso_rol (rol_id, horario_inicio, horario_fin) VALUES (?, ?, ?)`;
      await execute(insertHorarioQuery, [
        nuevoRolId,
        horarioInicio,
        horarioFin,
      ]);

      return {
        ok: true,
        msg: "Rol registrado exitosamente",
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/pantallas")
  public async getPantallas(): Promise<any | InternalServerError> {
    try {
      const query = "SELECT * FROM pantallas";
      const findPantallas = await execute(query);

      return {
        ok: true,
        data: findPantallas,
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        msg: "Error interno del sistema, por favor contacte al administrador del sistema",
        status: 500,
        err: err,
      };
    }
  }

  @Get('/rol/user')
  public async RolUser(@Header() token: any):Promise<any | InternalServerError> {
    try {
      const query = `SELECT arp.*, pa.*
      FROM users u
      JOIN empleados e ON u.empleado_id = e.empleado_id
      JOIN roles r ON e.rol = r.rol_id
      JOIN acceso_rol_pantalla arp ON r.rol_id = arp.rol_id
      JOIN pantallas pa ON arp.pantalla_id = pa.pantalla_id
      WHERE u.user_id = ?`;

      const findEUserRol = await execute(query, [+token.dataUsuario.user]);

      return {
        ok: true,
        status: 200,
        data: findEUserRol
      }
    } catch(err) {
      console.log(err);
      return {
        ok: false,
        msg: "Error interno del sistema al obtener la lista de roles",
        error: err,
        status: 500,
      };
    }
  }

  @Get("/roles")
  @Response<any>(200, "Lista de roles obtenida", {
    ok: true,
    msg: "Lista de roles obtenida exitosamente",
    status: 200,
  })
  @Response<InternalServerError>(500, "Internal Server Error", {
    ok: false,
    msg: "Error interno del sistema al obtener la lista de roles",
    error: {},
    status: 500,
  })
  public async obtenerRoles(): Promise<any | InternalServerError> {
    try {
      const query = `
      SELECT r.*, 
      GROUP_CONCAT(p_pantallas.nombre) AS pantallas_asociadas,
      h.horario_inicio,
      h.horario_fin
FROM roles r
LEFT JOIN acceso_rol_pantalla p ON r.rol_id = p.rol_id
LEFT JOIN horario_acceso_rol h ON r.rol_id = h.rol_id
LEFT JOIN pantallas p_pantallas ON p.pantalla_id = p_pantallas.pantalla_id
GROUP BY r.rol_id, h.horario_inicio, h.horario_fin
    `;
      const roles = await execute(query);
      return {
        ok: true,
        status: 200,
        data: roles,
      };
    } catch (err) {
      return {
        ok: false,
        msg: "Error interno del sistema al obtener la lista de roles",
        error: err,
        status: 500,
      };
    }
  }

}
