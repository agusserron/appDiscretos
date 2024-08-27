import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import institucionController from '../controllers/instituciones.js';


const router = Router()

router.getAsync('', institucionController.getInstituciones);
router.postAsync('/addInstitucion', institucionController.addInstitucionData);
router.postAsync('/delInstitucion', institucionController.delInstitucionData);
router.postAsync('/editInstitucion', institucionController.editInstitucionData);


export default router