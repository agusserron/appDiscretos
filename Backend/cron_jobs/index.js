import cron from 'node-cron'
import { CompanyRepository, PlantRepository, PresentaIAORepository, AireRepository} from "../shared/datos_db_repositories/index.js"
import { logInfo, logError } from '../shared/logger/logger.js'
import { getCompanys, getPlants, getPlantsIAO, getAireReport} from '../cron_jobs/utils/adapter.js'
import { getConnection } from '../shared/connectionMariaDB/connection.js'
import env from "dotenv"
env.config();

const { connection, release } = await getConnection();

const companyRepository = new CompanyRepository(connection)
const plantRepository = new PlantRepository(connection)
const presentaIAORepository = new PresentaIAORepository(connection)
const aireRepository = new AireRepository(connection)

const getAllCompanys = async (req, res) => {
  try {
    const companys = await getCompanys();
    logInfo(`GET adapter/companys totalCompanys:${JSON.stringify(companys[0].totalRegistros)}`);
    return companys;
  } catch (e) {
    logError(`Error gettingAllCompanys/${e}`);
  }
}

const getAllPlants = async (req, res) => {
  try {
    const plants = await getPlants();
    logInfo(`GET adapter/plants totalPlants:${JSON.stringify(plants[0].totalRegistros)}`);
    return plants;
  } catch (e) {
    logError(`Error gettingAllPlants/${e}`);
  }
}

const getPlantsWithIAO = async (req, res) => {
  try {
    const plants = await getPlantsIAO();
    logInfo(`GET adapter/plants/iao totalPlants:${JSON.stringify(plants[0].totalRegistros)}`);
    return plants;
  } catch (e) {
    logError(`Error gettingPlantsWithIAO/${e}`);
  }
}

const getAireByNroEnlace = async (nroEnlace) => {
  try {
    const report = await getAireReport(nroEnlace);
    return report;
  } catch (e) {
    logError(`Error gettingAireByNroEnlace Report/${e}`);
  }
}

const migrationCompanys = async () => {
  let totalMigrated = 0;
  const companys = await getAllCompanys();
  const lengthCompanys = companys[0].totalRegistros;
  for (let index = 1; index <= lengthCompanys; index++) {
    const rut = companys[index].rut;
    const nombre = companys[index].nombre;
    const quantity = await companyRepository.existRUTAndName(rut, nombre);
    let data = companys[index];
    if (quantity == 0) {
      await companyRepository.addMigration({ data });
      totalMigrated++;
      logInfo(`Company migrated, rut: ${JSON.stringify(rut)} ,name: ${JSON.stringify(nombre)}`);
    }
  }
  return { lengthCompanys, totalMigrated };
}

const migrationPlants = async () => {
  let totalMigrated = 0;
  const plants = await getAllPlants();
  const lengthPlants = plants[0].totalRegistros;
  for (let index = 1; index <= lengthPlants; index++) {
    //EMPRESA
    const rut = plants[index].rut;
    const nombreEmpresa = plants[index].nombre;
    let idEmpresa = await companyRepository.getId(rut, nombreEmpresa);
    //PLANTA
    const nombre = plants[index].pla_nombre;
    let nroEnlace = plants[index].pla_nro_enlace;
    if (nroEnlace == null) {
      nroEnlace = "0";
      plants[index].pla_nro_enlace = 0;
    }
    const quantity = await plantRepository.existPlant(idEmpresa, nombre, nroEnlace);
    let data = plants[index];
    if (quantity == 0) {
      let nombre = plants[index].pla_departamento ? plants[index].pla_departamento: 'MONTEVIDEO';
      const idDepartamento = await plantRepository.getDepartamentId(nombre);
      await plantRepository.add({ data, idEmpresa, idDepartamento }); //MODIFICAR ENTRA UN IDDEPARTAMENTO
      totalMigrated++;
      logInfo(`Plant migrated, idCompany: ${JSON.stringify(idEmpresa)} ,nroEnlace: ${JSON.stringify(nroEnlace)}`);
    }
  }
  return { lengthPlants, totalMigrated };
}

const migrationPresentacionIAO = async () => {
  let totalMigrated = 0;
  const plants = await getPlantsWithIAO();
  const lengthPlants = plants[0].totalRegistros;
  for (let index = 1; index <= lengthPlants; index++) {
    //EMPRESA
    const rut = plants[index].emp_numero_busqueda;
    let idEmpresa = await companyRepository.getIdByRUT(rut);
    if (idEmpresa != null) {
      //PLANTA
      let tipoIAO = plants[index].tip_pre_iao_nombre;
      if (tipoIAO != null) {
        let nroEnlace = plants[index].pla_nro_enlace;
        if (nroEnlace == null) {
          nroEnlace = "0";
          plants[index].pla_nro_enlace = 0;
        }
        const existPlant = await plantRepository.existNroEnlace(nroEnlace);
        if (existPlant > 0) {
          let plant = await plantRepository.get(nroEnlace);
          let idPlant = plant.id;
          let existIdPlant = await presentaIAORepository.existIdPlant(idPlant);
          let monitoreoAtmosfera = plants[index].det_pre_iao_monitoreo_atmos;
          let monitoreoCursos = plants[index].det_pre_iao_monitoreo_cursos;
          let monitoreoCalidadAire = plants[index].det_pre_iao_monitoreo_calidadaire;
          if (monitoreoAtmosfera == null) {
            plants[index].det_pre_iao_monitoreo_atmos = "f";
            monitoreoAtmosfera = "f";
          }
          if (monitoreoCursos == null) {
            plants[index].det_pre_iao_monitoreo_cursos = "f";
            monitoreoCursos = "f";
          }
          if (monitoreoCalidadAire == null) {
            plants[index].det_pre_iao_monitoreo_calidadaire = "f";
            monitoreoCalidadAire = "f";
          }
          let data = plants[index];
          if (existIdPlant > 0) {
            await presentaIAORepository.update({ data, idPlant });
          }
          else {
            await presentaIAORepository.add({ data, idPlant });
            totalMigrated++;
          }
        }
      }
    }
  }
  return { lengthPlants, totalMigrated };
}

const migrationAireReport = async () => {
  let totalMigrated = 0;
  let totalReports = 0;
  let nroEnlaces = await plantRepository.getAllNroEnlaces();
  const lengthReports = nroEnlaces.length;
  for (let index = 0; index < lengthReports; index++) {
    const nroEnlace = nroEnlaces[index].nroEnlace;
    const report = await getAireByNroEnlace(nroEnlace);
    const lengthDataReport = report[0].totalRegistros;
    totalReports += lengthDataReport;
    for (let index = 1; index <= lengthDataReport; index++) {
      const data = report[index];
      const fechaInicio = data.res_mon_cal_fecha_muestreo;
      const fechaFin = data.res_mon_cal_fecha_muestreo_fin;
      let valor = data.res_mon_cal_valor_discreto;
      const existPlant = await plantRepository.existNroEnlace(nroEnlace);
      if (existPlant > 0) {
        let plant = await plantRepository.get(nroEnlace);
        let idPlant = plant.id;
        if (valor == null) {
          data.res_mon_cal_valor_discreto = 0;
          valor = 0;
        }
        let nombrePunto = data.pun_mon_cal_air_iao_identificacion;
        let datos = {
          valor,
          fechaInicio,
          fechaFin,
          idPlant,
          nombrePunto
        }
        const quantity = await aireRepository.existReport(datos);
        if (quantity == 0) {
          const idUnidad = await aireRepository.getUnitId(data.uni_nombre);
          const idParametro = await aireRepository.getParameterId(data.par_nombre);
          await aireRepository.addMigrationReport({ data, idPlant, idParametro, idUnidad });
          totalMigrated++;
          logInfo(`Aire report migrated, idPlant: ${JSON.stringify(idPlant)} ,dateStartReport: ${JSON.stringify(fechaInicio)},
          dateEndReport: ${JSON.stringify(fechaFin)} ,nombrePunto: ${JSON.stringify(nombrePunto)} ,valor: ${JSON.stringify(valor)} `);
        }
      }
    }
  }
  return { totalReports, totalMigrated };
}

//INICIA UNA VEZ POR DIA 6:05 AM MIGRACIÓN DE EMPRESAS Y PLANTAS 
cron.schedule('00 5 6 * * *', async () => {
  try {
    logInfo(`Start task migration for company and plants, every day at 6:05 am`);
    const resultCompanys = await migrationCompanys();
    const resultPlants = await migrationPlants();
    logInfo(`Finish task migration companys from web service, totalCompanys: ${JSON.stringify(resultCompanys.lengthCompanys)} and totalMigrated: ${JSON.stringify(resultCompanys.totalMigrated)} `);
    logInfo(`Finish task migration plants from web service, totalPlants: ${JSON.stringify(resultPlants.lengthPlants)} and totalMigrated: ${JSON.stringify(resultPlants.totalMigrated)}`);
    logInfo('Migration daily for company and plants completed');
  }
  catch (e) {
    logError('Error running task migration.', e);
  }
});

//INICIA UNA VEZ POR DIA 6:10 AM MIGRACIÓN DE REPORTE DE CALIDAD DE AIRE
cron.schedule('00 10 6 * * *', async () => {
  try {
    logInfo(`Start migration aire report, every day at 6:10 am`);
    const resultReports = await migrationAireReport();
    logInfo(`Finish task migration aire report, totalAireReports: ${JSON.stringify(resultReports.totalReports)} and totalMigrated: ${JSON.stringify(resultReports.totalMigrated)} `);
  }
  catch (e) {
    logError('Error running task migration.', e);
  }
});


