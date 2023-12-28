import express from "express";
import PreCierreController from "../../controllers/Private/Pre-Cierre";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new PreCierreController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registrarPreCierre(_req.body, _req);
  return res.status(response.status).json(response);
});


export default router;
