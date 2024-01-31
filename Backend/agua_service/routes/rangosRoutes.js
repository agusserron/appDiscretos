import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import rangosController from '../controllers/rangos.js'

const router = Router()

router.getAsync('/normales', rangosController.getRangosNormales);
router.getAsync('/parametros', rangosController.getRangosParametros);
router.getAsync('/parametros/sitios', rangosController.getRangosParametrosSitios);

export default router