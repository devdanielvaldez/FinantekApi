import express from "express";
import AuthController from "../../controllers/Private/Auth";

const router = express.Router();
const controller = new AuthController();

router.post("/login", async (_req: any, res) => {
  const response: any = await controller.login(_req.body);
  return res.status(response.status).json(response);
});

router.post("/cambiar-contrasena", async (_req: any, res) => {
  const response: any = await controller.cambiarContrasena(_req.body);
  return res.status(response.status).json(response);
});


export default router;
