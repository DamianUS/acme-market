'use strict'
import mongoose from 'mongoose'
import dateFormat from 'dateformat'
import { customAlphabet } from 'nanoid'
import { schema as orderItemSchema } from './OrderItemModel.js'
const idGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const orderSchema = new mongoose.Schema({
  ticker: {
    type: String,
    unique: true,
    // This validation does not run after middleware pre-save
    validate: {
      validator: function (v) {
        return /\d{6}-\w{6}/.test(v)
      },
      message: 'ticker is not valid!, Pattern("d(6)-w(6)")'
    }
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

// Execute before each item.save() call
orderSchema.pre('save', function (callback) {
  const newOrder = this
  const day = dateFormat(new Date(), 'yymmdd')

  const generatedTicker = [day, idGenerator()].join('-')
  newOrder.ticker = generatedTicker

  callback()
})

const model = mongoose.model('Order', orderSchema)

export const schema = model.schema
export default model
