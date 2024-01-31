import { getPlantsIAO as getExternalIAO } from "../utils/adapterIAO.js"
import { logInfo, logError } from '../../shared/logger/logger.js'

const getPresentationIAO = async (req, res) => {
    try {
        const plantsIAO = await getExternalIAO();
        logInfo(`GET Sia/plantsWithIAO totalPlantsWithIAO: ${JSON.stringify(plantsIAO[0].totalRegistros)}`)
        return res.status(200).json(plantsIAO);
    } catch (e) {
        logError('Error getting plants with IAO from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

export default {
    getPresentationIAO
}