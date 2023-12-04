import express from "express";
import EmpleadosController from "../../controllers/Private/Empleados";

const router = express.Router();
const controller = new EmpleadosController();

router.post("/registrar", async (_req: any, res) => {
  const response: any = await controller.registrarEmpleado(_req.body);
  return res.status(response.status).json(response);
});

router.get('/search', async(_req: any, res) => {
  const response: any = await controller.getAllEmployeesByQuery(_req.query.emp_id, _req.query.nombre, _req.query.apellido, _req.query.cargo);
  return res.status(response.status).json(response);
});

router.put('/update/:empleadoId', async(_req: any, res) => {
  const response: any = await controller.updateEmployee(_req.params.empleadoId, _req.body);
  return res.status(response.status).json(response);
})

export default router;