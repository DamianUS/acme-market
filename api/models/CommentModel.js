'use strict'
import mongoose from 'mongoose'

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

//Not needed as it is used as a nested document in Item
//const model = mongoose.model('Comment', commentSchema)

export const schema = commentSchema
//export default model
