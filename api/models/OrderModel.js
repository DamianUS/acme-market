'use strict'
import mongoose from 'mongoose'
import dateFormat from 'dateformat'
import { customAlphabet } from 'nanoid'
import { schema as orderItemSchema } from './OrderItemModel.js'
const idGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const orderSchema = new mongoose.Schema({
  ticker: {
    type: String,
  },
  consumerName: {
    type: String,
    required: 'Consumer name required'
  },
  placementMoment: {
    type: Date,
    default: Date.now
  },
  deliveryMoment: {
    type: Date
  },
  cancelationMoment: {
    type: Date
  },
  deliveryAddress: {
    type: String,
    required: 'Delivery address required'
  },
  comments: [String],
  total: {
    type: Number,
    min: 0
  },
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'consumer id required',
    ref: 'Actor'
  },
  clerk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  },
  orderedItems: [orderItemSchema]
}, { strict: false })

const model = mongoose.model('Order', orderSchema)

export const schema = model.schema
export default model
