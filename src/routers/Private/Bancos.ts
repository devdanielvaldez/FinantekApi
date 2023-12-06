import express from "express";
import BancosController from "../../controllers/Private/Bancos";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new BancosController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registrarBanco(_req.body, _req);
  return res.status(response.status).json(response);
});

router.get("/ver-todos", async (_req: any, res) => {
  const response: any = await controller.verTodosLosBancos();
  return res.status(response.status).json(response);
});

router.get("/ver/:banco_id", async (req: any, res) => {
  const response: any = await controller.verBanco(req.params.banco_id);
  return res.status(response.status).json(response);
});

router.put("/actualizar/:banco_id", async (req: any, res) => {
  const response: any = await controller.actualizarBanco(req.params.banco_id, req.body);
  return res.status(response.status).json(response);
});

router.delete("/eliminar/:banco_id", async (req: any, res) => {
  const response: any = await controller.eliminarBanco(req.params.banco_id);
  return res.status(response.status).json(response);
});

export default router;
