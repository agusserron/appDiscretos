import express from 'express'
import userRouter from './routes/user.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const port = 3000

app.use(express.json())
app.disable('x-powered-by')
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, cache-control");
  res.header("Cache-Control", "no-cache, no-store");
  res.header("Pragma", "no-cache");
  next();
});

app.use(helmet.frameguard())
app.use(helmet.hsts({ maxAge: 300, includeSubDomains: true, preload: true }));
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 2 minutes)
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)
app.use('/api/users', userRouter)


app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`)
})