import express from 'express'
import aireRouter from './routes/aire.js'
import stationRouter from './routes/station.js'
import companyRouter from './routes/company.js'
import plantRouter from './routes/plant.js'
import corsMiddleware from '../shared/cors_middleware/corsMiddleware.js'
import helmet from 'helmet'

const app = express()
const port = 3001

app.use(express.json())
app.use(corsMiddleware.middlewareCors);
//app.use(helmet());

app.disable('x-powered-by');
app.use(helmet.frameguard());
//app.use( helmet.hsts( { maxAge: 300, includeSubDomains: true, preload: true } ) );
app.use('/api/aire', aireRouter);
app.use('/api/aire/plants', plantRouter);
app.use('/api/aire/companys', companyRouter);
app.use('/api/aire/station', stationRouter);

app.listen(port, () => {
  console.log(`Aire Service listening on port ${port}`)
})