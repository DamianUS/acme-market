'use strict'
import mongoose from 'mongoose'
import fs from 'fs'
import { streamToMongoDB } from 'stream-to-mongo-db'
import JSONStream from 'JSONStream'

//Hago la función async para poder usar el await import, ver si esto rompe algo.
const storeJsonInsertMany = async (req, res) => {
  let mongooseModel = null
  let sourceFile = null
  let response = ''
  if (req.query.mongooseModel && req.query.sourceFile) {
    //Recordatorio: Ahora los modelos tienen nombre en mayúscula y singular: Order, Actor
    mongooseModel = req.query.mongooseModel
    //Recordatorio: para que este import funcione sería una ruta que termine en .js
    sourceFile = req.query.sourceFile

    //Damián: No sé qué es sourceFile, pero pongo el equivalente a pelo
    const json = await import(sourceFile)
    const collectionModel = mongoose.model(mongooseModel)

    // where the data will end up
    console.log('inserting the json from file: ' + sourceFile + ', into the Model: ' + mongooseModel)
    collectionModel.insertMany(json, function (err, result) {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        response += 'All documents stored in the collection!'
        console.log(response)
        res.send(response)
      }
    })
  } else {
    if (req.query.mongooseModel == null) response += 'A mandatory mongooseModel parameter is missed.\n'
    if (req.query.sourceFile == null) response += 'A mandatory sourceFile parameter is missed.\n'
    console.log(response)
    res.send(response)
  }
}

const storeJsonFs = (req, res) => {
  //stream to mongo db no parece tener versión para es6, es de hace 4 años
  
  let dbURL = null
  let collection = null
  let sourceFile = null
  let batchSize = null
  let parseString = null
  let response = ''

  if (req.query.dbURL && req.query.collection && req.query.sourceFile) {
    dbURL = req.query.dbURL
    collection = req.query.collection
    sourceFile = req.query.sourceFile
    if (req.query.batchSize) batchSize = req.query.batchSize; else batchSize = 1000
    if (req.query.parseString) parseString = req.query.parseString; else parseString = '*.*'

    // where the data will end up
    const outputDBConfig = { dbURL: dbURL, collection: collection, batchSize: batchSize }

    // create the writable stream
    const writableStream = streamToMongoDB(outputDBConfig)

    // create readable stream and consume it
    console.log('starting streaming the json from file: ' + sourceFile + ', to dbURL: ' + dbURL + ', into the collection: ' + collection)
    fs.createReadStream(sourceFile) // './myJsonData.json'
      .pipe(JSONStream.parse(parseString))
      .pipe(writableStream)
      .on('finish', function () {
        response += 'All documents stored in the collection!'
        console.log(response)
        res.send(response)
      })
      .on('error', function (err) {
        console.log(err)
        res.send(err)
      })
  } else {
    if (req.query.dbURL == null) response += 'A mandatory dbURL parameter is missed.\n'
    if (req.query.collection == null) response += 'A mandatory collection parameter is missed.\n'
    if (req.query.sourceFile == null) response += 'A mandatory sourceFile parameter is missed.\n'
    console.log(response)
    res.send(response)
  }
}

export { storeJsonInsertMany, storeJsonFs }
