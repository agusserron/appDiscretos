import express from 'express'
import aguaRouter from './routes/aguaRoutes.js'
import estacionesRouter from './routes/estacionesRoutes.js'
import parametrosRouter from './routes/parametrosRoutes.js'
import programaRouter from './routes/programasRoutes.js'
import rangosRouter from './routes/rangosRoutes.js'
import corsMiddleware from '../shared/cors_middleware/corsMiddleware.js'
import helmet from 'helmet'
//import pool from '../shared/connectionMariaDB/sharedPool.js'

const app = express()
const port = 3002

app.use(express.json({limit: '50mb'}))
app.use(corsMiddleware.middlewareCors);
//app.use(helmet());

app.disable('x-powered-by');
app.use(helmet.frameguard());
//app.use( helmet.hsts( { maxAge: 300, includeSubDomains: true, preload: true } ) );

app.use('/api/agua', aguaRouter);
app.use('/api/agua/estaciones', estacionesRouter);
app.use('/api/agua/parametros', parametrosRouter);
app.use('/api/agua/programas', programaRouter);
app.use('/api/agua/rangos', rangosRouter);


app.listen(port, () => {
  console.log(`Agua Service listening on port ${port}`)
})