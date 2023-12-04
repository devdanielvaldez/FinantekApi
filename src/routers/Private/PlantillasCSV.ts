import express from "express";
import PlantillasCSVController from "../../controllers/Private/PlantillaCSV";

const router = express.Router();
const controller = new PlantillasCSVController();

router.post("/plantillas-csv", async (_req: any, res) => {
  const response: any = await controller.crearPlantillaCSV(_req.body);
  return res.status(response.status).json(response);
});

router.delete("/plantillas-csv/:plantilla_id", async (_req: any, res) => {
  const response: any = await controller.eliminarPlantillaCSV(_req.params.plantilla_id);
  return res.status(response.status).json(response);
});

router.put("/plantillas-csv/:plantilla_id", async (_req: any, res) => {
  const response: any = await controller.actualizarPlantillaCSV(_req.params.plantilla_id, _req.body);
  return res.status(response.status).json(response);
});

router.get("/plantillas-csv/:plantilla_id", async (_req: any, res) => {
    const response: any = await controller.obtenerPlantillaCSV(_req.params.plantilla_id);
    return res.status(response.status).json(response);
  });

  router.get("/plantillas-csv/empresa/:empresa_id", async (_req: any, res) => {
    const response: any = await controller.obtenerTodasPlantillasEmpresa(_req.params.empresa_id);
    return res.status(response.status).json(response);
  });
  

export default router;
