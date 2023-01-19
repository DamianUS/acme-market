'use strict'
import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
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

//Not needed as it is used as a nested document in Order
//const model = mongoose.model('OrderItem', orderItemSchema)

export const schema = orderItemSchema
//export default model
