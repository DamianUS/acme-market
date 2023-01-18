'use strict'
import { storeJsonInsertMany, storeJsonFs } from '../controllers/StorageController.js'

export default function (app) {

  // Data Storage routes
  /*
  *
  * Bad option: Put a large json with documents from a file into a collection of mongoDB
  *
  * @section storage
  * @type post
  * @url /v1/storage/insertMany
  * @param {string} mongooseModel  //mandatory
  * @param {string} sourceFile   //mandatory
  * Sample 1 (actors): http://localhost:8080/v1/storage/insertMany?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Market&mongooseModel=Actors&sourceFile=c:/temp/Actors.json
  * Sample 2 (test):   http://localhost:8080/v1/storage/insertMany?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Market&mongooseModel=Test&sourceFile=c:/temp/many_npm.json
  */
  app.route('/v1/storage/insertMany')
    .post(storeJsonInsertMany)

  /**
   * Put a large json with documents from a file into a collection of mongoDB
   *
   * @section storage
   * @type post
   * @url /v1/storage/fs
   * @param {string} dbURL       //mandatory
   * @param {string} collection  //mandatory
   *  @param {string} sourceURL   //mandatory
   * @param {string} batchSize   //optional
   * @param {string} parseString //optional
   * Sample 1 (actors): http://localhost:8080/v1/storage/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Market&collection=actors&batchSize=100&parseString=*&sourceFile=c:\temp\Actors.json
   * Sample 2 (test):   http://localhost:8080/v1/storage/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Market&collection=test&batchSize=100&parseString=rows.*&sourceFile=c:\temp\many_npm.json
  */
  app.route('/v1/storage/fs')
    .post(storeJsonFs)
}
