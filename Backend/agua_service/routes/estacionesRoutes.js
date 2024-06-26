import {Router} from '@awaitjs/express'
import estacionController from '../controllers/estacion.js'

const router = Router()

router.getAsync('', estacionController.getEstaciones);
router.getAsync('/tipoPunto', estacionController.getTipoPuntoEstacion);
router.get('/subcuenca', estacionController.getSubcuenca);

export default router