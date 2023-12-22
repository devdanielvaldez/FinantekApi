import express from "express";
import SolicitudesController from "../../controllers/Private/Solicitudes";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new SolicitudesController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.createLoanRequest(_req.body, _req);
  return res.status(response.status).json(response);
});

router.get("/solicitudes", validateToken, async (_req: any, res) => {
  const response: any = await controller.getAllLoanRequestsByCompany(_req);
  return res.status(response.status).json(response);
});

router.get("/solicitudes/:id", validateToken, async (_req: any, res) => {
  const response: any = await controller.getLoanRequestByIdAndCompany(_req, _req.params.id);
  return res.status(response.status).json(response);
});

router.put("/solicitudes/:id/editar", validateToken, async (_req: any, res) => {
  const response: any = await controller.updateLoanRequest(_req, _req.params.id, _req.body);
  return res.status(response.status).json(response);
});

router.put("/solicitudes/:solicitud_id/actualizar-estado", validateToken, async (_req: any, res) => {
  const response: any = await controller.updateLoanRequestStatus(_req, _req.params.solicitud_id, _req.body);
  return res.status(response.status).json(response);
});

router.get("/solicitudes/:solicitud_id/estados", validateToken, async (_req: any, res) => {
  const response: any = await controller.processEstados(_req, _req.params.solicitud_id);
  return res.status(response.status).json(response);
});

router.delete("/solicitudes/:id/eliminar", validateToken, async (_req: any, res) => {
  const response: any = await controller.getLoanRequestByIdAndCompany(_req, _req.params.id);
  return res.status(response.status).json(response);
});



export default router;
