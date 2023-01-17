'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customAlphabet = require('nanoid').customAlphabet
const skuGenerator = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

const CategorySchema = new Schema({
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

const CommentSchema = new Schema({
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

const ItemSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Categories'
  },
  comments: [CommentSchema],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

ItemSchema.index({ category: 1, price: 1 }) // 1 ascending,  -1 descending
ItemSchema.index({ name: 'text', description: 'text', sku: 'text' })

// Execute before each item.save() call
ItemSchema.pre('save', function (callback) {
  const newItem = this
  newItem.sku = skuGenerator()
  callback()
})

module.exports = mongoose.model('Items', ItemSchema)
module.exports = mongoose.model('Categories', CategorySchema)
