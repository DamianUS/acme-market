'use strict'
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the Category'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the Category'
  },
  picture: {
    data: Buffer, contentType: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

const model = mongoose.model('Category', categorySchema)

export const schema = model.schema
export default model
