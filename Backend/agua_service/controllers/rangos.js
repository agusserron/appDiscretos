import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)

const getRangosNormales = async (req,res) => {
    try {
        const rangosNormales = await aguaRepository.getRangosNormales({});
        logInfo(`GET getRangosNormales from database`);
        res.status(200).json(rangosNormales);
    } catch (e) {
        logError(`Error getRangosNormales/${e}`);
        res.status(500).json({ message: "Error, obteniendo los rangos normales." });
    } finally {
        release();
    }
}

const getRangosParametros = async (req,res) => {
    try {
        const rangosParametros = await aguaRepository.getRangosParametros({});
        logInfo(`GET getRangosParametros from database`);
        res.status(200).json(rangosParametros);
    } catch (e) {
        logError(`Error getRangosParametros/${e}`);
        res.status(500).json({ message: "Error, obteniendo los rangos parametros." });
    } finally {
        release();
    }
}

const getRangosParametrosSitios = async (req,res) => {
    try {
        const rangosParametrosSitios = await aguaRepository.getRangosParametrosSitios({});
        logInfo(`GET getRangosParametrosSitios from database`);
        res.status(200).json(rangosParametrosSitios);
    } catch (e) {
        logError(`Error getRangosParametrosSitios/${e}`);
        res.status(500).json({ message: "Error, obteniendo los rangos parametros sitios." });
    } finally {
        release();
    }
}

export default {
    getRangosNormales,
    getRangosParametros,
    getRangosParametrosSitios
}
