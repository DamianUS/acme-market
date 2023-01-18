'use strict'
/* ---------------ITEM---------------------- */
import Item from '../models/ItemModel.js'

const listItemsV0 = (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      res.send(err)
    } else {
      res.json(items)
    }
  })
}

const listItems = (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.find({}, (err, items) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(items)
    }
  })
}

const createItemV0 =  (req, res) => {
  const newItem = new Item(req.body)
  newItem.save( (err, item) => {
    if (err) {
      res.send(err)
    } else {
      res.json(item)
    }
  })
}

const createItem =  (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newItem = new Item(req.body)
  newItem.save( (err, item) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(item)
    }
  })
}

const readItem =  (req, res) => {
  Item.findById(req.params.itemId,  (err, item) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(item)
    }
  })
}

const updateItemV0 =  (req, res) => {
  Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true },  (err, item) => {
    if (err) {
      res.send(err)
    } else {
      res.json(item)
    }
  })
}

const updateItem =  (req, res) => {
  // Check that the user is administrator if it is updating more things than comments and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true },  (err, item) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(item)
    }
  })
}

const deleteItemV0 =  (req, res) => {
  Item.deleteOne({ _id: req.params.itemId },  (err, item) => {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Item successfully deleted' })
    }
  })
}

const deleteItem =  (req, res) => {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.deleteOne({ _id: req.params.itemId },  (err, item) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Item successfully deleted' })
    }
  })
}

const searchItems =  (req, res) => {
  // In further version of the code we will:
  // 1.- control the authorization in order to include deleted items in the results if the requester is an Administrator.
  // 2.- use indexes to search keywords in 'name', 'description' or 'sku'.
  // Checking if itemName is null or not. If null, all items are returned.
  const query = {}
  query.name = req.query.itemName != null ? req.query.itemName : /.*/

  if (req.query.categoryId) {
    query.category = req.query.categoryId
  }
  if (req.query.deleted) {
    query.deleted = req.query.deleted
  }

  let skip = 0
  if (req.query.startFrom) {
    skip = parseInt(req.query.startFrom)
  }
  let limit = 0
  if (req.query.pageSize) {
    limit = parseInt(req.query.pageSize)
  }
  let sort = ''
  if (req.query.reverse === 'true') {
    sort = '-'
  }
  if (req.query.sortedBy) {
    sort += req.query.sortedBy
  }

  console.log('Query: ' + query + ' Skip:' + skip + ' Limit:' + limit + ' Sort:' + sort)

  Item.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec( (err, item) => {
      console.log('Start searching items')
      if (err) {
        res.send(err)
      } else {
        res.json(item)
      }
      console.log('End searching items')
    })
}

export { listItemsV0, listItems, createItem, createItemV0, readItem, updateItemV0, updateItem, deleteItemV0, deleteItem, searchItems }
