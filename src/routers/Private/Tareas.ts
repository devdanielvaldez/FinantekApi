import express from "express";
import TareasController from "../../controllers/Private/Tareas"; // Asegúrate de importar el controlador correcto

const router = express.Router();
const controller = new TareasController();

router.post("/crear", async (req, res) => {
  const response = await controller.crearTarea(req.body);
  return res.status(response.status).json(response);
});

router.put("/update/:tarea_id", async (req: any, res) => {
  const response = await controller.actualizarTarea(req.params.tarea_id, req.body);
  return res.status(response.status).json(response);
});

router.delete("/delete/:tarea_id", async (req: any, res) => {
  const response = await controller.eliminarTarea(req.params.tarea_id);
  return res.status(response.status).json(response);
});

router.get('/mis-tareas', async(req: any, res) => {
    const response = await controller.obtenerMisTareas(req.query.empleado_id, req.query.supervisor_id);
    return res.status(response.status).json(response);
})

// Puedes agregar más rutas según tus necesidades, como obtener todas las tareas de un empleado o supervisor, etc.

export default router;
