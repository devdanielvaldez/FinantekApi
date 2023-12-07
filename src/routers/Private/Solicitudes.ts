import express from "express";
import SolicitudesController from "../../controllers/Private/Solicitudes";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new SolicitudesController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.createLoanRequest(_req.body);
  return res.status(response.status).json(response);
});

router.get("/solicitudes", validateToken, async (_req: any, res) => {
  const response: any = await controller.getAllLoanRequestsByCompany(_req.params.empresa_id);
  return res.status(response.status).json(response);
});

router.get("/solicitudes/:empresa_id/:id", validateToken, async (_req: any, res) => {
  const response: any = await controller.getLoanRequestByIdAndCompany(_req.params.empresa_id, _req.params.id);
  return res.status(response.status).json(response);
});

router.put("/solicitudes/:empresa_id/:id/editar", validateToken, async (_req: any, res) => {
  const response: any = await controller.updateLoanRequest(_req.params.empresa_id, _req.params.id, _req.body);
  return res.status(response.status).json(response);
});

router.put("/solicitudes/:empresa_id/:solicitud_id/actualizar-estado", validateToken, async (_req: any, res) => {
  const response: any = await controller.updateLoanRequest(_req.params.empresa_id, _req.params.solicitud_id, _req.body);
  return res.status(response.status).json(response);
});

router.delete("/solicitudes/:empresa_id/:id/eliminar", validateToken, async (_req: any, res) => {
  const response: any = await controller.getLoanRequestByIdAndCompany(_req.params.empresa_id, _req.params.id);
  return res.status(response.status).json(response);
});



export default router;
