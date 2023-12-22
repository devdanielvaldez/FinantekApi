import express from "express";
import PrestamoController from "../../controllers/Private/Prestamos";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new PrestamoController();

router.post("/generar-amortizacion", validateToken, async (_req: any, res) => {
  const response: any = await controller.generarAmortizacionPrestamo(_req.body, _req);
  return res.status(response.status).json(response);
});

router.get("/all", validateToken, async (_req: any, res) => {
  const response: any = await controller.allPrestamos(_req);
  return res.status(response.status).json(response);
});

router.post("/generar-amortizacion-preview", validateToken, async (_req: any, res) => {
  const response: any = await controller.generarAmortizacionPreview(_req.body, _req);
  return res.status(response.status).json(response);
});
  
router.post('/generar-prestamo', validateToken, async (_req: any, res) => {
  const response: any = await controller.crearYRegistrarPrestamo(_req.body, _req);
  return res.status(response.status).json(response);
})

router.post('/pagar-cuota', validateToken, async (_req: any, res) => {
  const response: any = await controller.pagarCuota(_req.body, _req);
  return res.status(response.status).json(response);
})

router.post('/aplicar-abono', validateToken, async (_req: any, res) => {
  const response: any = await controller.aplicarAbono(_req.body, _req);
  return res.status(response.status).json(response);
})

router.get('/:id', validateToken, async (_req: any, res) => {
  const response: any = await controller.getLoanById(_req.params.id);
  return res.status(response.status).json(response);
})

router.get('/atraso', validateToken, async (_req: any, res) => {
  const response: any = await controller.prestamosAtraso(_req);
  return res.status(response.status).json(response);
})

export default router;
