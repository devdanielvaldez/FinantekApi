import express from "express";
import ClientesController from "../../controllers/Private/Clientes";

const router = express.Router();
const controller = new ClientesController();

router.post("/registrar", async (_req: any, res) => {
  const response: any = await controller.registerClients(_req.body);
  return res.status(response.status).json(response);
});

router.get('/all/:emp_id', async(_req: any, res) => {
    const response: any = await controller.getAllClients(_req.params.emp_id);
    return res.status(response.status).json(response);
});

router.put('/update', async(_req: any, res) => {
  const response: any = await controller.updateClient(_req.body);
  return res.status(response.status).json(response);
});

router.put('/actualizar-estado-cliente', async(_req: any, res) => {
  const response: any = await controller.updateClientStatus(_req.body);
  return res.status(response.status).json(response);
});

export default router;
