import { getPlants as getExternalPlants } from "../utils/adapterPlant.js"
import { logInfo, logError } from '../../shared/logger/logger.js'

const getPlants = async (req, res) => {
    try {
        const plants = await getExternalPlants();
        logInfo(`GET /Generadores/listAndPlants totalCompanysWithPlants: ${JSON.stringify(plants[0].totalRegistros)}`)
        return res.status(200).json(plants);
    } catch (e) {
        logError('Error getting plants from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

export default {
    getPlants
}
