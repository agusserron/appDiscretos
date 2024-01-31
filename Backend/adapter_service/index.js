import express from 'express'
import companysRouter from './routes/routes.js'

const app = express()
const port = 3003

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.disable('x-powered-by')

app.use('/adapter/api', companysRouter)

app.listen(port, () => {
  console.log(`Adapter service listening on ${port}`)
})