import { getAireReport as getExternalAireReport} from "../utils/adapterAire.js"
import { logInfo, logError } from '../../shared/logger/logger.js'

const getReport = async (req, res) => {
    try {
        const nroEnlace = req.header("nroEnlace")
        const report = await getExternalAireReport(nroEnlace);
        logInfo(`GET Report Sia/plantsAirQualityMonitoring/nroEnlace: `+ nroEnlace)
        return res.status(200).json(report);
    } catch (e) {
        logError('Error getting report from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

const getStationsAire = async (req, res) => {
    try {
        const report = await getExternalAirStations();
        return res.status(200).json(report);
    } catch (e) {
        logError('Error getting stations from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

const getStationsAireReport = async (req, res) => {
    try {
        const code = req.header("code")
        const report = await getExternalAirStationsReport(code);
        return res.status(200).json(report);
    } catch (e) {
        logError('Error getting stations from database.', e)
        return res.status(500).json({ message: "Error connecting to database SIA" });
    }
}

export default {
    getReport,
    getStationsAire,
    getStationsAireReport
}
