import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import actorRoutes from './api/routes/ActorRoutes.js'
import itemRoutes from './api/routes/ItemRoutes.js'
import categoryRoutes from './api/routes/CategoryRoutes.js'
import orderRoutes from './api/routes/OrderRoutes.js'
import storageRoutes from './api/routes/StorageRoutes.js'
import dataWarehouseRoutes from './api/routes/DataWareHouseRoutes.js'
import { createDataWareHouseJob } from './api/controllers/DataWareHouseController.js'
import initMongoDBConnection from './api/config/mongoose.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

actorRoutes(app)
itemRoutes(app)
orderRoutes(app)
storageRoutes(app)
dataWarehouseRoutes(app)
categoryRoutes(app)

try{
  await initMongoDBConnection()
  app.listen(port, function () {
    console.log('ACME-Market RESTful API server started on: ' + port)
  })
}
catch(err){
  console.error('ACME-Market RESTful API could not connect to DB ' + err)
}

createDataWareHouseJob()
