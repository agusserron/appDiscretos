import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)

const getEstaciones = async (req,res) => {
    try {
        const estaciones = await aguaRepository.getEstaciones({});
        logInfo(`GET getEstaciones from database`);
        res.status(200).json(estaciones);
    } catch (e) {
        logError(`Error getEstaciones/${e}`);
        res.status(500).json({ message: "Error, obteniendo las estaciones." });
    } finally {
        release();
    }
}

const getTipoPuntoEstacion = async (req,res) => {
    try {
        const tipoPuntoEstaciones = await aguaRepository.getTipoPuntoEstacion({});
        logInfo(`GET getTipoPuntoEstacion from database`);
        res.status(200).json(tipoPuntoEstaciones);
    } catch (e) {
        logError(`Error getTipoPuntoEstacion/${e}`);
        res.status(500).json({ message: "Error, obteniendo los tipo punto estacion." });
    } finally {
        release();
    }
}

export default {
    getEstaciones,
    getTipoPuntoEstacion,
}
