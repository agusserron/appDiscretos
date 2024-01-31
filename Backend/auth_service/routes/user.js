import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js'
import Roles from '../../shared/authorization_middleware/roles.js'
import userController from '../controllers/user.js'

const router = Router()

router.postAsync('/login', userController.login)
router.getAsync('/user', auth.dataToken, auth.authRolePermissions([Roles.ADMIN,Roles.AIRE]), userController.getDataUser)

export default router
