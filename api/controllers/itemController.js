'use strict'
const mongoose = require('mongoose')
/* ---------------ITEM---------------------- */
const Item = mongoose.model('Items')

exports.list_all_items_v0 = function (req, res) {
  Item.find({}, function (err, items) {
    if (err) {
      res.send(err)
    } else {
      res.json(items)
    }
  })
}

exports.list_all_items = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.find({}, function (err, items) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(items)
    }
  })
}

exports.create_an_item_v0 = function (req, res) {
  const newItem = new Item(req.body)
  newItem.save(function (err, item) {
    if (err) {
      res.send(err)
    } else {
      res.json(item)
    }
  })
}

exports.create_an_item = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newItem = new Item(req.body)
  newItem.save(function (err, item) {
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

exports.read_an_item = function (req, res) {
  Item.findById(req.params.itemId, function (err, item) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(item)
    }
  })
}

exports.update_an_item_v0 = function (req, res) {
  Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true }, function (err, item) {
    if (err) {
      res.send(err)
    } else {
      res.json(item)
    }
  })
}

exports.update_an_item = function (req, res) {
  // Check that the user is administrator if it is updating more things than comments and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, { new: true }, function (err, item) {
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

exports.delete_an_item_v0 = function (req, res) {
  Item.deleteOne({ _id: req.params.itemId }, function (err, item) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Item successfully deleted' })
    }
  })
}

exports.delete_an_item = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Item.deleteOne({ _id: req.params.itemId }, function (err, item) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Item successfully deleted' })
    }
  })
}

exports.search_items = function (req, res) {
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
    .exec(function (err, item) {
      console.log('Start searching items')
      if (err) {
        res.send(err)
      } else {
        res.json(item)
      }
      console.log('End searching items')
    })
}

/* ---------------CATEGORY---------------------- */
const Category = mongoose.model('Categories')

exports.list_all_categories = function (req, res) {
  Category.find({}, function (err, categs) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(categs)
    }
  })
}

exports.create_a_category = function (req, res) {
  const newCategory = new Category(req.body)
  newCategory.save(function (err, categ) {
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

exports.read_a_category = function (req, res) {
  Category.findById(req.params.categId, function (err, categ) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(categ)
    }
  })
}

exports.update_a_category = function (req, res) {
  Category.findOneAndUpdate({ _id: req.params.categId }, req.body, { new: true }, function (err, categ) {
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

exports.delete_a_category = function (req, res) {
  Category.deleteOne({ _id: req.params.categId }, function (err, categ) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Category successfully deleted' })
    }
  })
}
