import express from "express";
import ClientesController from "../../controllers/Private/Clientes";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new ClientesController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registerClients(_req.body, _req);
  return res.status(response.status).json(response);
});

router.get('/all', validateToken, async(_req: any, res) => {
    const response: any = await controller.getAllClients(_req);
    return res.status(response.status).json(response);
});

router.get('/:id', validateToken, async(_req: any, res) => {
  const response: any = await controller.getClientById(_req, _req.params.id);
  return res.status(response.status).json(response);
});

router.put('/actualizar-estado-cliente', validateToken, async(_req: any, res) => {
  const response: any = await controller.updateClientStatus(_req.body);
  return res.status(response.status).json(response);
});

export default router;
