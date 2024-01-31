import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)

const getProgramas = async (req,res) => {
    try {
        const programas = await aguaRepository.getProgramas({});
        logInfo(`GET getProgramas from database`);
        res.status(200).json(programas);
    } catch (e) {
        logError(`Error getProgramas/${e}`);
        res.status(500).json({ message: "Error, obteniendo los programas." });
    } finally {
        release();
    }
}

const getProgramasParametros = async (req,res) => {
    try {
        const programasParametros = await aguaRepository.getProgramasParametros({});
        logInfo(`GET getProgramasParametros from database`);
        res.status(200).json(programasParametros);
    } catch (e) {
        logError(`Error getProgramasParametros/${e}`);
        res.status(500).json({ message: "Error, obteniendo los programas parametros." });
    } finally {
        release();
    }
}

export default {
    getProgramas,
    getProgramasParametros
}
