import axios from 'axios';
import HttpsProxyAgent from "https-proxy-agent";
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import jwt_decode from "jwt-decode";
import env from "dotenv";
env.config({ path: "../shared/authorization_middleware/.env" });

const agentHttp = new HttpsProxyAgent({ host: "172.20.2.9", port: 8080 })

const verifyToken = async (req, res, next) => {
    const authorization = req.header("Authorization");
    if (sanitizer.containsXSS(authorization)) return res.status(400).json({ message: "Error en sintáxis" });
    const token = authorization ? authorization.replace("Bearer ", "") : null;
    if (!token) {
        const error = "Se requiere un token de acceso";
        return res.status(403).send(error);
    }
    const baseApi = axios.create({
        baseURL: process.env.LOGINMA,
        proxy: false,
        httpsAgent: agentHttp,
        headers: { 'Authorization': token }
    })
    try {
        const { data } = await baseApi.get("/getDataUser")
        if (data.ok) {
            const username = data.data.usuario
            const roles = data.data.roles
            let userData = { "username": username, "roles": roles }
            req.user = userData;
        } else {
            return res.status(403).send("Error verificando token");
        }
    } catch (e) {
        const error = "Error verificando el token";
        return res.status(500).send(error);
    }
    return next();
};

const authRolePermissions = (permissions) => {
    return (req, res, next) => {
        const userRole = req.user.roles;
        if (permissions.length == 0 || userRole.some(role => permissions.includes(role))) {
            next();
        } else {
            const error = "No cuenta con los permisos";
            return res.status(401).send(error);
        }
    }
};

const dataToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const decoded = jwt_decode(token);
        const username = decoded.data.nombre;
        const roles = decoded.data.roles;
        let userData = { "username": username, "roles": roles };
        req.user = userData;
    }
    catch (e) {
        const error = "Error verificando el token";
        return res.status(500).send(error);
    }
    return next();
}

export default {
    verifyToken,
    authRolePermissions,
    dataToken
}
