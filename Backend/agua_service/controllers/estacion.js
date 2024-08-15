import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/estacionAguaSchema.js";
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

const existeEstacion = async (req, res) => {
 
    const { codigo, nombre } = req.query;

    console.log('Código:', codigo);
    console.log('Nombre:', nombre);
    if (!codigo && !nombre) {
      return res.status(400).json({ message: "Código o nombre son requeridos." });
    } 
    try { 
      const exists = await aguaRepository.existeEstacion(codigo, nombre);
      console.log(exists)
      res.status(200).json({ exists });
    } catch (e) {

      logError(`Error existeEstacion/${e}`);
      res.status(500).json({ message: "Error verificando la existencia de la estación." });
    }
  };


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


const getSubcuenca = async (req, res) => {
    const data = req.query; 

    if (!data.lat || !data.long) {
        return res.status(400).json({ message: "Latitud y longitud son requeridas." });
    }
    try {
        const subcuenca = await aguaRepository.getSubcuencaByLatLong(data.lat, data.long);
        logInfo(`GET subcuenca by LatLong from database`);
        res.status(200).json(subcuenca);
    } catch (e) {
        logError(`Error getSubcuencaByLatLong/${e}`);
        res.status(500).json({ message: "Error obteniendo la subcuenca por latitud y longitud." });
    }
};

const getCuencaId = async (req,res) => {
    let nroCuenca = req.query.nroCuenca;
    try {
        const cuenca = await aguaRepository.getCuencaId(nroCuenca);
        logInfo(`GET getCuencaId from database`);
        res.status(200).json(cuenca);
    } catch (e) {
        logError(`Error getCuencaId/${e}`);
        res.status(500).json({ message: "Error, obteniendo la cuenca." });
    } finally {
        release();
    }
}

const addEstacionAgua = async (req, res) => {
  let data = req.body;
  console.log("unoooo" + JSON.stringify(data, null, 2));
  try {

      if (sanitizer.containsXSS(data)) {
          return res.status(400).json({ message: "Error en sintaxisXXS" });
      }
      if (!validator.validateJson(data, schemas.aguaEstacionSchema)) {
          return res.status(400).json({ message: "Error en sintaxisJSON" });
      }


      console.log("dooos" + data)
      if (!data.codigo || !data.nombre) {
          return res.status(400).json({ message: "Código y nombre son requeridos para la verificación." });
      }
      
      const exists = await aguaRepository.existeEstacion(data.codigo, data.nombre);
      console.log("existe" + exists)
      if (exists) {
          return res.status(400).json({ message: "La estación ya existe." });
      }

      await aguaRepository.addStationAgua(data);
      logInfo(`POST addEstacionAgua`);
      res.status(201).json({ message: "Estación de agua agregada correctamente" });

  } catch (e) {
      console.error('Error en addEstacionAgua:', e); 
      logError(`Error addEstacionAgua`);
      res.status(500).json({ message: "Error al agregar la estación de agua." });
  } finally {
      release(); 
  }
};


export default {
    getEstaciones,
    getTipoPuntoEstacion,
    getSubcuenca,
    getCuencaId,
    existeEstacion,
    addEstacionAgua
}
