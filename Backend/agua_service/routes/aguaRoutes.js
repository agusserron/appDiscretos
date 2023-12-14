import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import aguaController from '../controllers/agua.js'

const router = Router()

//TEST - TO DELETE
router.postAsync('', aguaController.addAguaData);
router.getAsync('/reports', aguaController.getAguaReports);
//END

router.getAsync('/matrices', aguaController.getMatrices);
router.getAsync('/unidades', aguaController.getUnidades);
router.getAsync('/instituciones', aguaController.getInstituciones);
router.getAsync('/departamentos', aguaController.getDepartamentos);
router.getAsync('/muestras', aguaController.getMuestras);
router.getAsync('/enumerados', aguaController.getEnumerados);

export default router
