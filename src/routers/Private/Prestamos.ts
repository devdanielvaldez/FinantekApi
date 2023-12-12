import express from "express";
import PrestamoController from "../../controllers/Private/Prestamos";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new PrestamoController();

router.post("/generar-amortizacion", validateToken, async (_req: any, res) => {
  const response: any = await controller.generarAmortizacionPrestamo(_req.body, _req);
  return res.status(response.status).json(response);
});
  
router.post('/generar-prestamo', validateToken, async (_req: any, res) => {
  const response: any = await controller.crearYRegistrarPrestamo(_req.body, _req);
  return res.status(response.status).json(response);
})

export default router;
