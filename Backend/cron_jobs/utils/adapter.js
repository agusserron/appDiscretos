import axios from 'axios'
import HttpsProxyAgent from "https-proxy-agent"

const agentHttp = new HttpsProxyAgent({ host: "172.20.2.9", port: 8080 })
const baseApi = axios.create({
  baseURL: "http://localhost:3003/adapter/api",
  proxy: false,
  httpsAgent: agentHttp,
})

export const getCompanys = async () => {
  const { data } = await baseApi.get(`/companys`)
  return data
}

export const getPlants = async () => {
  const { data } = await baseApi.get(`/plants`)
  return data
}

export const getPlantsIAO = async () => {
  const { data } = await baseApi.get(`/plants/iao`)
  return data
}

export const getAireReport = async (numeroEnlace) => {
  const { data } = await baseApi.get(`/aire/report`, {
    headers: {
      nroEnlace: numeroEnlace
    }
  })
  return data
}
