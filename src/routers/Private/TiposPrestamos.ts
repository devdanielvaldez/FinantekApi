import express from "express";
import TiposPrestamosController from "../../controllers/Private/TiposPrestamos";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new TiposPrestamosController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registerLoanType(_req.body, _req);
  return res.status(response.status).json(response);
});

router.get('/por-empresa', validateToken, async(_req: any, res) => {
    const response: any = await controller.getLoanTypesByCompany(_req);
    return res.status(response.status).json(response);
})

router.put('/actualizar', validateToken, async(_req: any, res) => {
    const response: any = await controller.updateLoanType(_req.body, _req);
    return res.status(response.status).json(response);
})

export default router;
