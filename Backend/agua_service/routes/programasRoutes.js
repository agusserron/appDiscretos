import {Router} from '@awaitjs/express'
import porgramaController from '../controllers/programa.js'

const router = Router()

router.getAsync('', porgramaController.getProgramas);
router.getAsync('/parametros', porgramaController.getProgramasParametros);
router.getAsync('/:programId', porgramaController.getEstacionesPrograma); 
router.put('/data', porgramaController.updateProgramStatus);
router.postAsync('/programa', porgramaController.addProgram);


export default router