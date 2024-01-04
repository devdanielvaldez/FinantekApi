import express from "express";
import validateToken from "../../api/middlewares/decodedToken";
import UtilsEnumsController from "../../controllers/Private/UtilsEnums";

const router = express.Router();
const controller = new UtilsEnumsController();

router.get('/provincias', validateToken, async(_req: any, res) => {
    const response: any = await controller.getProvincias(_req);
    return res.status(response.status).json(response);
})

router.get('/municipios/:id', validateToken, async(_req: any, res) => {
    const response: any = await controller.getMunicipios(_req, _req.params.id);
    return res.status(response.status).json(response);
})

router.get('/tipos-frecuencias', validateToken, async(_req: any, res) => {
    const response: any = await controller.tiposFrecuencias();
    return res.status(response.status).json(response);
})

router.get('/codes', validateToken, async(_req: any, res) => {
    const response: any = await controller.codesPlantillas();
    return res.status(response.status).json(response);
})

router.get('/prelacion', validateToken, async(_req: any, res) => {
    const response: any = await controller.prelacionEnums();
    return res.status(response.status).json(response);
})

router.post('/files', validateToken, async(_req: any, res) => {
    const response: any = await controller.uploadFiles(_req);
    return res.status(response.status).json(response);
})

export default router;
