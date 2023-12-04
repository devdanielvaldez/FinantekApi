import express from "express";
import TiposPrestamosController from "../../controllers/Private/TiposPrestamos";

const router = express.Router();
const controller = new TiposPrestamosController();

router.post("/registrar", async (_req: any, res) => {
  const response: any = await controller.registerLoanType(_req.body);
  return res.status(response.status).json(response);
});

router.get('/por-empresa/:empresa_id', async(_req: any, res) => {
    const response: any = await controller.getLoanTypesByCompany(_req.body);
    return res.status(response.status).json(response);
})

router.put('/actualizar', async(_req: any, res) => {
    const response: any = await controller.updateLoanType(_req.body);
    return res.status(response.status).json(response);
})

export default router;
