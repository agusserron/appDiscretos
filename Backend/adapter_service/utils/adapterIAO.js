import axios from 'axios'
import  HttpsProxyAgent from "https-proxy-agent"

const agentHttp = new HttpsProxyAgent({host: "172.20.2.9", port: 8080})
const baseApi = axios.create({
  baseURL: `http://172.20.10.70/apiMA/index.php/Sia`,
  proxy: false,
  httpsAgent: agentHttp,
})

export const getPlantsIAO = async () => {
    const {data} = await baseApi.get("/plantsWithIAO")
    return data
}