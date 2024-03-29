import express from "express";
import PersonasController from "../../controllers/Private/Personas";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new PersonasController();

router.post("/registrar", validateToken, async (_req: any, res) => {
  const response: any = await controller.registrarPersona(_req.body);
  return res.status(response.status).json(response);
});

router.get('/all', async (_req: any, res) => {
    const response: any = await controller.getPersonas(_req.body);
    return res.status(response.status).json(response);
});

router.get('/dni', async (_req: any, res) => {
    const response: any = await controller.getPeopleByDNI(_req.query);
    return res.status(response.status).json(response);
});

router.get('/persona-por-id/:id', async(_req: any, res) => {
    const response: any = await controller.getPersonaById(_req.params.id);
    return res.status(response.status).json(response);
});

router.put('/actualizar', async(_req: any, res) => {
  const response: any = await controller.actualizarPersonaExistente(_req.body);
  return res.status(response.status).json(response);
})

export default router;