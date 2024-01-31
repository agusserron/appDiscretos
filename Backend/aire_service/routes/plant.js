import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import plantController from '../controllers/plant.js'
import Roles from '../../shared/authorization_middleware/roles.js'

const router = Router()

router.getAsync('/nrosEnlace',auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), plantController.getAllNrosEnlace)
router.postAsync('/add',auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), plantController.addPlant)
router.getAsync('/nroEnlace',auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), plantController.getPlant)
router.getAsync('', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), plantController.getPlants)
router.getAsync('/departaments', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), plantController.getDepartaments)

export default router