'use strict'
/* ---------------ITEM---------------------- */
import Item from '../models/ItemModel.js'

const listItemsV0 = async (req, res) => {
  try{
    const items = await Item.find({})
    res.json(items)
  }
  catch(err){
    res.send(err)
  }
}

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

const createItemV0 = async (req, res) => {
  const newItem = new Item(req.body)
  try {
    const item = await newItem.save()
    res.json(item)
  }
  catch (err) {
    res.send(err)
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

const updateItemV0 =  async (req, res) => {
  try{
    const item = await Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true })
    res.json(item)
  }
  catch(err){
    res.send(err)
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

const deleteItemV0 = async (req, res) => {
  try{
    await Item.deleteOne({ _id: req.params.itemId })
    res.json({ message: 'Item successfully deleted' })
  }
  catch(err){
    res.send(err)
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

const _generate_query_object = (req) => {
  const query = {}
  query.name = req.query.itemName != null ? req.query.itemName : /.*/
  if (req.query.categoryId) {
    query.category = req.query.categoryId
  }
  if (req.query.deleted) {
    query.deleted = req.query.deleted
  }
  return query
}

const searchItems = async (req, res) => {
  // In further version of the code we will:
  // 1.- control the authorization in order to include deleted items in the results if the requester is an Administrator.
  // 2.- use indexes to search keywords in 'name', 'description' or 'sku'.
  // Checking if itemName is null or not. If null, all items are returned.
  const query = _generate_query_object(req)
  const skip = req.query.startFrom ? parseInt(req.query.startFrom) : 0
  const limit = req.query.pageSize ? parseInt(req.query.pageSize) : 0
  let sort = req.query.reverse === 'true' ? '-' : ''
  if (req.query.sortedBy) {
    sort += req.query.sortedBy
  }
  console.log('Query: ' + query + ' Skip:' + skip + ' Limit:' + limit + ' Sort:' + sort)
  try{
    const items = await Item.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    res.json(items)
  }
  catch(err){
    res.status(500).send(err)
  }
}

export { listItemsV0, listItems, createItem, createItemV0, readItem, updateItemV0, updateItem, deleteItemV0, deleteItem, searchItems }
