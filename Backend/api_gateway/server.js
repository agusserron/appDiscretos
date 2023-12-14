import express from 'express'
import helmet from 'helmet'
import aireRoutes from './routes/microservice_aire/aireRoutes.js'
import authRoutes from './routes/microservice_auth/authRoutes.js'
import aguaRoutes from './routes/microservice_agua/aguaRoutes.js'
import setupProxies from './proxy/proxy.js'
import setupProxyAuth from './proxy/proxyAuth.js'

const app = express()
const port = 3005

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, cache-control");
    res.send();
});

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, cache-control");
    res.header("Cache-Control", "no-cache, no-store");
    res.header("Pragma", "no-cache");
    next();
});

app.use(helmet());

//Microservice Auth
setupProxyAuth(app,authRoutes);

//Microservice Aire
setupProxies(app, aireRoutes);

//Microservice Agua
setupProxies(app, aguaRoutes);


app.use(express.json())

app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`)
})