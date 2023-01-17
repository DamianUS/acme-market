'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
  id: {
    type: String
  },
  key: {
    type: String
  },
  value: { rev: String }
}, { strict: false })

module.exports = mongoose.model('Test', TestSchema)
