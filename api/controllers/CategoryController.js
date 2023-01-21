'use strict'
/* ---------------ITEM---------------------- */
import Category from '../models/CategoryModel.js'

const listCategories =  async (req, res) => {
  try{
    const categories = await Category.find({})
    res.json(categories)
  }
  catch(err){
    res.status(500).send(err)
  }
}

const createCategory = async (req, res) => {
  const newCategory = new Category(req.body)
  try{
    const category = await newCategory.save()
    res.json(category)
  }
  catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categId)
    if(category){
      res.json(category)
    }
    else{
      res.status(404).send("Category not found")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const updateCategory = async (req, res) => {
  try{
    const category = await Category.findOneAndUpdate({ _id: req.params.categId }, req.body, { new: true })
    if(category){
      res.json(category)
    }
    else{
      res.status(404).send("Category not found")
    }
  }
  catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteCategory = async (req, res) => {
  try {
    const deletionResponse = await Category.deleteOne({ _id: req.params.categId })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Category successfully deleted' })
    }
    else {
      res.status(404).send("Category could not be deleted")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export { listCategories, createCategory, readCategory, updateCategory, deleteCategory }