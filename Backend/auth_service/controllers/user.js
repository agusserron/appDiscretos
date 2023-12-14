import env from "dotenv";
import validator from 'validator';
import { logInfo, logError } from "../../shared/logger/logger.js";
import axios from 'axios';
import  HttpsProxyAgent from "https-proxy-agent";
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
env.config({ path: "../auth_service/.env" });

const agentHttp = new HttpsProxyAgent({host: "172.20.2.9", port: 8080})
const baseApi = axios.create({
  baseURL: process.env.LOGINMA,
  proxy: false,
  httpsAgent: agentHttp,
})

const login = async (req, res) => {
  const body = req.body;
  if(sanitizer.containsXSS(body)) return res.status(400).json({message:"Error en sintáxis"});
  const username = body.username;
  const password = body.password;
  if (validator.isEmpty(username)) {
    res.status(400).send('Se debe ingresar un usuario.');
  }
  if (validator.isEmpty(password)) {
    res.status(400).send('Se debe ingresar una contraseña.');
  }
  let user = {
    "usuario": username,
    "password": password,
    "ttl": 14400 //OJO AL CAMBIAR, ESTO CORRESPONDE 4HS Y EL FRONTEND TIENE LA MISMA CONFIGURACION
  }

  try {
    const {data} = await baseApi.post("/login",user);
    let token = "";
    if(data.ok){
      token = data.data.token;
    }
    else{
      return res.status(401).send('Usuario o contraseña incorrecta.');
    }
  
    logInfo(`POST login/username: ${username}`);
    res.status(200).json({ token });

  } catch (e) {
    logError(`Error login/username: ${username}/${e}`);
    res.status(500).send('Error, servicio sin conexión.');
  } 
}


const getDataUser = async (req, res) => {
  const token = req.headers.authorization
  if(sanitizer.containsXSS(token)) return res.status(400).json({message:"Error en sintáxis"});
  if (validator.isEmpty(token)) {
    res.status(400).send('Se debe enviar un token.')
  }
  try {
    const agentHttp = new HttpsProxyAgent({host: "172.20.2.9", port: 8080});
    const baseApi2 = axios.create({
      baseURL: process.env.LOGINMA,
      proxy: false,
      httpsAgent: agentHttp,
      headers: {'Authorization': token}
    })
    const {data} = await baseApi2.get("/getDataUser");
    if(data.ok){
      logInfo(`GET getDataUser/username: ${req.user.username}`);
      const nombre = data.data.nombre;
      const roles = data.data.roles;
      res.status(200).json({"nombre": nombre, "roles": roles })
    }
    else{
      return res.status(401).send('Token inválido.');
    }

  } catch (e) {
    logError(`Error getDataUser/${e}/username:  ${req.user.username}`);
    res.status(500).send('Error, usuario no encontrado.');
  }
}

export default {
  login,
  getDataUser
}