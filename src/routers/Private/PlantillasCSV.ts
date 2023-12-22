import express from "express";
import PlantillasCSVController from "../../controllers/Private/PlantillaCSV";
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new PlantillasCSVController();

router.post("/plantillas-csv", validateToken, async (_req: any, res) => {
  const response: any = await controller.crearPlantillaCSV(_req.body, _req);
  return res.status(response.status).json(response);
});

router.put("/plantillas-csv/:plantilla_id", validateToken, async (_req: any, res) => {
  const response: any = await controller.eliminarPlantillaCSV(_req.params.plantilla_id);
  return res.status(response.status).json(response);
});

router.get("/plantillas-csv/:plantilla_id", validateToken, async (_req: any, res) => {
    const response: any = await controller.obtenerPlantillaCSV(_req.params.plantilla_id);
    return res.status(response.status).json(response);
  });

  router.get("/plantillas-csv/", validateToken, async (_req: any, res) => {
    const response: any = await controller.obtenerTodasPlantillasEmpresa(_req);
    return res.status(response.status).json(response);
  });
  

export default router;
