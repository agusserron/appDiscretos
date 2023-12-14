import { getCompanys as getExternalCompanys } from "../utils/adapterCompany.js"
import { logInfo, logError } from '../../shared/logger/logger.js'

const getCompanys = async (req, res) => {
    try {
        const companys = await getExternalCompanys();
        logInfo(`GET /Generadores/list totalCompanys: ${JSON.stringify(companys[0].totalRegistros)}`)
        return res.status(200).json(companys);
    } catch (e) {
        logError('Error getting companys from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

export default {
    getCompanys
}
