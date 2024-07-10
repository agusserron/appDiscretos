import {Router} from '@awaitjs/express'
import estacionController from '../controllers/estacion.js'

const router = Router()

router.getAsync('', estacionController.getEstaciones);
router.getAsync('/tipoPunto', estacionController.getTipoPuntoEstacion);
router.getAsync('/subcuenca', estacionController.getSubcuenca);
router.getAsync('/cuenca', estacionController.getCuencaId);

export default router