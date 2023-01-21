'use strict'
import mongoose from 'mongoose'
import { schema as commentSchema } from './CommentModel.js'

const itemSchema = new mongoose.Schema({
  sku: {
    type: String,
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

const model = mongoose.model('Item', itemSchema)

export const schema = model.schema
export default model
