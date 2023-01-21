'use strict'
/* ---------------ITEM---------------------- */
import Item from '../models/ItemModel.js'

const listItems = async (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try{
    const items = await Item.find({})
    res.json(items)
  }
  catch(err){
    res.status(500).send(err)
  }
}

const createItem = async (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newItem = new Item(req.body)
  try{
    const item = await newItem.save()
    res.json(item)
  }
  catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (item) {
      res.json(item)
    }
    else {
      res.status(404).send("Item not found")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const updateItem = async (req, res) => {
  // Check that the user is administrator if it is updating more things than comments and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try {
    const item = await Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true })
    if (item) {
      res.json(item)
    }
    else {
      res.status(404).send("Item not found")
    }
  }
  catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteItem = async (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try {
    const deletionResponse = await Item.deleteOne({ _id: req.params.itemId })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Item successfully deleted' })
    }
    else {
      res.status(404).send("Item could not be deleted")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export { listItems, createItem, readItem, updateItem, deleteItem }
