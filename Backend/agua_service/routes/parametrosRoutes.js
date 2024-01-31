import {Router} from '@awaitjs/express'
import parametroController from '../controllers/parametro.js'

const router = Router()

router.getAsync('', parametroController.getParametros);
router.getAsync('/unidades', parametroController.getParametrosUnidades);
router.getAsync('/grupos', parametroController.getGruposParametros);
router.getAsync('/codigos/silad', parametroController.getCodigosSiladParametros);

export default router