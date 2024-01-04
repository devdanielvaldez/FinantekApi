import express from "express";
import EmpresasController from "../../controllers/Private/Empresas";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new EmpresasController();

router.post("/registrar", async (_req: any, res) => {
  const response: any = await controller.registrarEmpresas(_req.body);
  console.log(response);
  return res.status(response.status).json(response);
});

router.get('/all', async(_req: any, res) => {
  const response: any = await controller.consultarEmpresas(_req.query);
  return res.status(response.status).json(response);
});

router.put('/actualizar', async(_req: any, res) => {
  const response: any = await controller.actualizarEmpresa(_req.body);
  return res.status(response.status).json(response);
});

router.get('/empresa-conectada', validateToken, async(_req: any, res) => {
  const response: any = await controller.empresaConectada(_req);
  return res.status(response.status).json(response);
})

export default router;