import {Router} from '@awaitjs/express'
import porgramaController from '../controllers/programa.js'

const router = Router()

router.getAsync('', porgramaController.getProgramas);
router.getAsync('/parametros', porgramaController.getProgramasParametros);

export default router