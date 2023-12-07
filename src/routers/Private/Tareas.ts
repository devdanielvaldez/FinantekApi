import express from "express";
import TareasController from "../../controllers/Private/Tareas"; // Asegúrate de importar el controlador correcto
import validateToken from "../../api/middlewares/decodedToken";

const router = express.Router();
const controller = new TareasController();

router.post("/crear", validateToken, async (req, res) => {
  const response = await controller.crearTarea(req.body, req);
  return res.status(response.status).json(response);
});

router.put("/update/:tarea_id", validateToken, async (req: any, res) => {
  const response = await controller.actualizarTarea(req.params.tarea_id, req.body);
  return res.status(response.status).json(response);
});

router.delete("/delete/:tarea_id", validateToken, async (req: any, res) => {
  const response = await controller.eliminarTarea(req.params.tarea_id);
  return res.status(response.status).json(response);
});

router.get('/mis-tareas', validateToken, async(req: any, res) => {
    const response = await controller.obtenerMisTareas(req);
    return res.status(response.status).json(response);
})

export default router;
