'use strict'
import mongoose from 'mongoose'
import { customAlphabet } from 'nanoid'
const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the comment'
  },
  author: {
    type: String
  },
  commentText: {
    type: String,
    required: 'Kindly enter your comments'
  },
  stars: {
    type: Number,
    required: 'Kindly enter the stars',
    min: 0,
    max: 5
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

const model = mongoose.model('Comment', commentSchema)

export const schema = model.schema
export default model
