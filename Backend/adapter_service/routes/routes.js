import {Router} from '@awaitjs/express'
const router = Router()
import companysController from '../controllers/companys.js'
import plantsController from '../controllers/plants.js'
import iaoController from '../controllers/iao.js'
import aireController from '../controllers/aire.js'

router.getAsync('/plants', plantsController.getPlants)
router.getAsync('/companys', companysController.getCompanys)
router.getAsync('/plants/iao', iaoController.getPresentationIAO)
router.getAsync('/aire/report', aireController.getReport)


export default router