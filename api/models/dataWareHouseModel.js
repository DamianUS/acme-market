'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataWareHouseSchema = new mongoose.Schema({
  topCancellers: [{
    type: Schema.Types.ObjectId
  }],
  topNotCancellers: [{
    type: Schema.Types.ObjectId
  }],
  bottomNotCancellers: [{
    type: Schema.Types.ObjectId
  }],
  topClerks: [{
    type: Schema.Types.ObjectId
  }],
  bottomClerks: [{
    type: Schema.Types.ObjectId
  }],
  ratioCancelledOrders: {
    type: Number,
    max: 1,
    min: 0
  },
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false })

DataWareHouseSchema.index({ computationMoment: -1 })

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema)
