'use strict'
import mongoose from 'mongoose'

const dataWareHouseSchema = new mongoose.Schema({
  topCancellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  topNotCancellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  bottomNotCancellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  topClerks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  bottomClerks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
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

dataWareHouseSchema.index({ computationMoment: -1 })

const model = mongoose.model('DataWareHouse', dataWareHouseSchema)
export const schema = model.schema
export default model