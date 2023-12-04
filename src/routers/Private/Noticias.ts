import express from "express";
import NoticiasController from "../../controllers/Private/Noticias";

const router = express.Router();
const controller = new NoticiasController();

router.post("/registrar", async (_req: any, res) => {
  const response: any = await controller.registrarNoticia(_req.body);
  return res.status(response.status).json(response);
});

router.get('/empresa/:empresa_id', async (_req: any, res) => {
    const response: any = await controller.getNoticiasByEmpresa(_req.params.empresa_id);
    return res.status(response.status).json(response);
});

router.put('/update/:noticia_id', async(_req: any, res) => {
    const response: any = await controller.updateNoticia(_req.params.noticia_id, _req.body);
    return res.status(response.status).json(response);
});

router.delete('/delete/:noticia_id', async(_req: any, res) => {
    const response: any = await controller.deleteNoticia(_req.params.noticia_id);
    return res.status(response.status).json(response);
});

export default router;