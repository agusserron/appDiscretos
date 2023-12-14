import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)

const getParametros = async (req,res) => {
    try {
        const parameters = await aguaRepository.getParametros({});
        logInfo(`GET getParameters from database`);
        res.status(200).json(parameters);
    } catch (e) {
        logError(`Error getParameters/${e}`);
        res.status(500).json({ message: "Error, obteniendo los parametros." });
    } finally {
        release();
    }
}

const getParametrosUnidades = async (req,res) => {
    try {
        const parametrosUnidades = await aguaRepository.getParametrosUnidades({});
        logInfo(`GET getParametrosUnidad from database`);
        res.status(200).json(parametrosUnidades);
    } catch (e) {
        logError(`Error getParametrosUnidad/${e}`);
        res.status(500).json({ message: "Error, obteniendo los parametros unidades." });
    } finally {
        release();
    }
}

const getCodigosSiladParametros = async (req,res) => {
    try {
        const codigosParametros = await aguaRepository.getCodigosSiladParametros({});
        logInfo(`GET getCodigosSiladParametros from database`);
        res.status(200).json(codigosParametros);
    } catch (e) {
        logError(`Error getCodigosSiladParametros/${e}`);
        res.status(500).json({ message: "Error, obteniendo los codigos silad parametros." });
    } finally {
        release();
    }
}

const getGruposParametros = async (req,res) => {
    try {
        const gruposParametros = await aguaRepository.getGruposParametros({});
        logInfo(`GET getGruposParametros from database`);
        res.status(200).json(gruposParametros);
    } catch (e) {
        logError(`Error getGruposParametros/${e}`);
        res.status(500).json({ message: "Error, obteniendo los grupos parametros." });
    } finally {
        release();
    }
}

export default {
    getParametros,
    getParametrosUnidades,
    getCodigosSiladParametros,
    getGruposParametros
}




