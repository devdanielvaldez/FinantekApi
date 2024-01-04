import express from "express";
import RolController from "../../controllers/Private/Roles"; // Asegúrate de importar el controlador correcto
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new RolController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registrarRol(_req.body);
  return res.status(response.status).json(response);
});

router.get("/roles", validateToken, async (_req: any, res) => {
  const response: any = await controller.obtenerRoles();
  return res.status(response.status).json(response);
});

router.get("/pantallas", validateToken, async (_req: any, res) => {
  const response: any = await controller.getPantallas();
  return res.status(response.status).json(response);
});

router.get("/rol/user", validateToken, async (_req: any, res) => {
  const response: any = await controller.RolUser(_req);
  return res.status(response.status).json(response);
});

export default router;