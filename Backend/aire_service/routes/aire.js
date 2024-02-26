import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js'
import aireController from '../controllers/aire.js'
import Roles from '../../shared/authorization_middleware/roles.js'
const router = Router()

router.postAsync('', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.addAireData)
router.getAsync('/report', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getAireReport)
router.getAsync('/parameters', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getParameters)
router.getAsync('/units', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getUnits)
router.getAsync('/report/filter/city', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getAireReportByCity)

//AGUS
router.getAsync('/nombresPuntos/:empresaId', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getNombresPuntos);
router.getAsync('/latLong', auth.verifyToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), aireController.getLatLongPunto);



export default router
