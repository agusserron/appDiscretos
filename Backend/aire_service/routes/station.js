import {Router} from '@awaitjs/express'
import auth from '../../shared/authorization_middleware/auth.js';
import stationController from '../controllers/station.js'
import Roles from '../../shared/authorization_middleware/roles.js'

const router = Router()

router.postAsync('', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.addStationAire)
router.getAsync('', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.getStations)
router.putAsync('', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.updateStationAire)
router.deleteAsync('', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.deleteStationAire)
router.postAsync('/report', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.addStationReport)
router.getAsync('/report', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.getStationReports)
router.getAsync('/institutes', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.getInstitutes)
router.getAsync('/periods', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.getPeriods)
router.getAsync('/parameters', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.getParameters)
router.putAsync('/data', auth.dataToken, auth.authRolePermissions([Roles.AIRE, Roles.ADMIN]), stationController.deleteDataStation)



export default router
