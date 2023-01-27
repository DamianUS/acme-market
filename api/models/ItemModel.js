'use strict'
import mongoose from 'mongoose'
import { customAlphabet } from 'nanoid'
import { schema as commentSchema } from './CommentModel.js'
const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const itemSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    // This validation is not executed after the middleware pre-save
    validate: {
      validator: function (v) {
        return /^\w{6}$/.test(v)
      },
      message: 'sku is not valid!, Pattern("^w{6}$")'
    }
  },
  deleted: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: 'Kindly enter the item name'
  },
  description: {
    type: String,
    required: 'Kindly enter the description'
  },
  price: {
    type: Number,
    required: 'Kindly enter the item price',
    min: 0
  },
  picture: {
    data: Buffer, contentType: String
  },
  averageStars: {
    type: Number,
    min: 0,
    max: 5
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  comments: [commentSchema],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

// Execute before each item.save() call
itemSchema.pre('save', function (callback) {
  const newItem = this
  newItem.sku = skuGenerator()
  callback()
})

const model = mongoose.model('Item', itemSchema)

export const schema = model.schema
export default model
