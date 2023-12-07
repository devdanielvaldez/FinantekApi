import express from "express";
import PrestamoController from "../../controllers/Private/Prestamos";

const router = express.Router();
const controller = new PrestamoController();

router.post("/generar", async (_req: any, res) => {
  const response: any = await controller.generarPrestamo(_req.body);
  return res.status(response.status).json(response);
});
  
export default router;
