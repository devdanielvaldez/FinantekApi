import express from "express";

import validateToken from "../../api/middlewares/decodedToken";
import DesembolsoController from "../../controllers/Private/Desembolso";

const router = express.Router();
const controller = new DesembolsoController();

router.get("/all", validateToken, async (_req: any, res) => {
  const response: any = await controller.getAllDesembolso(_req);
  return res.status(response.status).json(response);
});

router.post("/", validateToken, async (_req: any, res) => {
  const response: any = await controller.desembolsarPorCliente(_req.body, _req);
  return res.status(response.status).json(response);
});

export default router;
