'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dateFormat = require('dateformat')
const customAlphabet = require('nanoid').customAlphabet
const idGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const OrderedItemSchema = new Schema({
  sku: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\w{6}$/.test(v)
      },
      message: 'sku is not valid!, Pattern("^w{6}$")'
    }
  },
  name: {
    type: String,
    required: 'Item name required'
  },
  quantity: {
    type: Number,
    min: 1
  },
  price: {
    type: Number,
    min: 0
  },
  served: {
    type: Boolean,
    default: false
  }
}, { strict: false })

const OrderSchema = new mongoose.Schema({
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
    type: Schema.Types.ObjectId,
    required: 'consumer id required'
  },
  clerk: {
    type: Schema.Types.ObjectId
  },
  orderedItems: [OrderedItemSchema]
}, { strict: false })

OrderSchema.index({ consumer: 1 })
OrderSchema.index({ clerk: 1 })
OrderSchema.index({ cancelationMoment: 1 })
OrderSchema.index({ deliveryMoment: 1 })

// Execute before each item.save() call
OrderSchema.pre('save', function (callback) {
  const newOrder = this
  const day = dateFormat(new Date(), 'yymmdd')

  const generatedTicker = [day, idGenerator()].join('-')
  newOrder.ticker = generatedTicker

  callback()
})
module.exports = mongoose.model('Orders', OrderSchema)
