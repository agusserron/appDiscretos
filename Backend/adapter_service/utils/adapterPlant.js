import axios from 'axios'
import  HttpsProxyAgent from "https-proxy-agent"

//const agentHttp = new HttpsProxyAgent({host: "172.20.2.9", port: 8080})
const baseApi = axios.create({
  baseURL: `https://ws.ambiente.gub.uy/apiResiduosGen/index.php/Generadores`,
  proxy: false,
  //httpsAgent: agentHttp,
})

export const getPlants = async () => {
    const {data} = await baseApi.get("/listAndPlants")
    return data
}
