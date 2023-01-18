'use strict'
/* ---------------ITEM---------------------- */
import Category from '../models/CategoryModel.js'

const listCategories =  (req, res) => {
  Category.find({},  (err, categs) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(categs)
    }
  })
}

const createCategory =  (req, res) => {
  const newCategory = new Category(req.body)
  newCategory.save( (err, categ) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(categ)
    }
  })
}

const readCategory =  (req, res) => {
  Category.findById(req.params.categId,  (err, categ) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(categ)
    }
  })
}

const updateCategory =  (req, res) => {
  Category.findOneAndUpdate({ _id: req.params.categId }, req.body, { new: true },  (err, categ) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(categ)
    }
  })
}

const deleteCategory =  (req, res) => {
  Category.deleteOne({ _id: req.params.categId },  (err, categ) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Category successfully deleted' })
    }
  })
}

export { listCategories, createCategory, readCategory, updateCategory, deleteCategory }