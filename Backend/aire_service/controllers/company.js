import { CompanyRepository, PlantRepository } from "../../shared/datos_db_repositories/index.js";
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/companySchema.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();

const companyRepository = new CompanyRepository(connection)
const plantRepository = new PlantRepository(connection)

const getCompanies = async (req, res) => {
    try {
        const companies = await companyRepository.get({});
        logInfo(`GET getCompanies from database/username: ${req.user.username}`);
        res.status(200).json(companies);
    } catch (e) {
        logError(`Error getCompanies/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo datos de las compañias." });
    }
    finally {
        release();
    }
}

const addCompany = async (req, res) => {
    let data = req.body;
    try {
        if (!validator.validateJson(data, schemas.companySchema)) return res.status(400).json({ message: "Error en sintáxis" });
        if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });
        const existRUT = await companyRepository.existRUT(data.rut);
        if (existRUT == 0) {
            await companyRepository.add({ data });
            logInfo(`POST addCompany/rutEmpresa/${data.rut} to database /username: ${req.user.username}`);
            res.status(201).json({ message: "Empresa agregada correctamente" });
        }
        else {
            logInfo(`POST rutAlreadyExist addCompany/rutEmpresa/${data.rut} to database /username: ${req.user.username}`);
            res.status(409).json({ message: "El rut ya existe y esta asociado a una empresa" });
        }
    } catch (e) {
        logError(`Error addCompany/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, agregando una empresa." });
    }
    finally {
        release();
    }
}

const existRUTCompany = async (req, res) => {
    let rutEmpresa = req.query.rutEmpresa;
    try {
        if (sanitizer.containsXSS(rutEmpresa)) return res.status(400).json({ message: "Error en sintáxis" });
        const company = await companyRepository.existRUT(rutEmpresa);
        logInfo(`GET existRUTCompany from database /username: ${req.user.username}`);
        res.status(200).json({ existRUT: Number(company) });
    } catch (e) {
        logError(`Error existRUTCompany/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, verificando la existencia de un rut." });
    }
    finally {
        release();
    }
}

const getNrosEnlace = async (req, res) => {
    let nombreEmpresa = req.query.nombreEmpresa;
    try {
        if (sanitizer.containsXSS(nombreEmpresa)) return res.status(400).json({ message: "Error en sintáxis" });
        const response = await plantRepository.getNroEnlaces(nombreEmpresa);
        let nroEnlaces = [];
        response.forEach(element => {
            nroEnlaces.push(element.nroEnlace)
        });
        logInfo(`GET getNroEnlaces for a company name /username: ${req.user.username}`);
        res.status(200).json({ nroEnlaces });
    } catch (e) {
        logError(`Error getNrosEnlace/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo los numeros de enlace de las compañias." });
    }
    finally {
        release();
    }
}

export default {
    getCompanies,
    getNrosEnlace,
    existRUTCompany,
    addCompany,
}