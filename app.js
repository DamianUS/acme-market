import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import initMongoDBConnection from './config/mongoose.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Hello world route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

try{
  await initMongoDBConnection()
  app.listen(port, function () {
    console.log('ACME-Market RESTful API server started on: ' + port)
  })
}
catch(err){
  console.error('ACME-Market RESTful API could not connect to DB ' + err)
}