import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import companyController from '../controllers/company.js'
import Roles from '../../shared/authorization_middleware/roles.js'


const router = Router()

router.getAsync('', auth.dataToken,auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]),companyController.getCompanies)
router.getAsync('/nroEnlace',auth.dataToken,auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), companyController.getNrosEnlace) 
router.getAsync('/rut',auth.dataToken,auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), companyController.existRUTCompany)
router.postAsync('/add',auth.dataToken,auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), companyController.addCompany)

export default router