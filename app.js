const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const Actor = require('./api/models/actorModel')
const Item = require('./api/models/itemModel')
const Order = require('./api/models/orderModel')
const Test = require('./api/models/testModel')
const DataWareHouse = require('./api/models/dataWareHouseModel') // created model loading here
const DataWareHouseTools = require('./api/controllers/dataWareHouseController')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routesActors = require('./api/routes/actorRoutes')
const routesItems = require('./api/routes/itemRoutes')
const routesOrders = require('./api/routes/orderRoutes')
const routesStorage = require('./api/routes/storageRoutes')
const routesDataWareHouse = require('./api/routes/dataWareHouseRoutes') // importing route

routesActors(app)
routesItems(app)
routesOrders(app)
routesStorage(app)
routesDataWareHouse(app)

// MongoDB URI building
const mongoDBUser = process.env.DATABASE_USER || 'myUser'
const mongoDBPass = process.env.DATABASE_PASSWORD || 'myUserPassword'
const mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ':' + mongoDBPass + '@' : ''

const mongoDBHostname = process.env.DATABASE_HOST || 'localhost'
const mongoDBPort = process.env.DATABASE_PORT || '27017'
const mongoDBName = process.env.DATABASE_NAME || 'ACME-Market'

const mongoDBURI = process.env.DATABASE_URI || 'mongodb://' + mongoDBCredentials + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName
mongoose.set('useCreateIndex', true)
// mongoose.set('debug', true); //util para ver detalle de las operaciones que se realizan contra mongodb
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false)
// mongoose.connect(mongoDBURI)
mongoose.connect(mongoDBURI, {
  // reconnectTries: 10,
  // reconnectInterval: 500,
  poolSize: 10, // Up to 10 sockets
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // skip trying IPv6
  useNewUrlParser: true,
  useUnifiedTopology: true
})
console.log('Connecting DB to: ' + mongoDBURI)

mongoose.connection.on('open', function () {
  app.listen(port, function () {
    console.log('ACME-Market RESTful API server started on: ' + port)
  })
})

mongoose.connection.on('error', function (err) {
  console.error('DB init error ' + err)
})
//DataWareHouseTools.createDataWareHouseJob()
