'use strict'

const mongoose = require('mongoose')
const Order = mongoose.model('Orders')

exports.list_all_orders = function (req, res) {
  Order.find({}, function (err, order) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(order)
    }
  })
}

exports.list_my_orders = function (req, res) {
  Order.find({}, function (err, orders) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(orders)
    }
  })
}

exports.create_an_order_v0 = function (req, res) {
  const newOrder = new Order(req.body)

  newOrder.save(function (error, order) {
    if (error) {
      res.send(error)
    } else {
      res.json(order)
    }
  })
}

exports.create_an_order = function (req, res) {
  // Check that user is a Customer and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newOrder = new Order(req.body)

  newOrder.save(function (err, order) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(order)
    }
  })
}

exports.search_orders = function (req, res) {
  // if clerkId is null, i.e. parameter is not in the URL, the search retrieves orders not assined to any clerk
  // else, the search retrieves orders assined to the specified clerk
  const query = {}
  query.clerk = req.query.clerkId

  if (req.query.cancelled === 'true') {
    // retrieving orders with a cancelationMoment
    query.cancelationMoment = { $exists: true }
  }
  if (req.query.cancelled === 'false') {
    // retrieving orders without a cancelationMoment
    query.cancelationMoment = { $exists: false }
  }
  if (req.query.delivered === 'true') {
    // retrieving orders with a deliveryMoment
    query.deliveryMoment = { $exists: true }
  }
  if (req.query.delivered === 'false') {
    // retrieving orders without a deliveryMoment
    query.deliveryMoment = { $exists: false }
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

  Order.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, order) {
      console.log('Start searching orders')
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(order)
      }
      console.log('End searching orders')
    })
}

exports.read_an_order = function (req, res) {
  Order.findById(req.params.orderId, function (err, order) {
    if (err) {
      res.send(err)
    } else {
      res.json(order)
    }
  })
}

exports.update_an_order_v0 = function (req, res) {
  Order.findById(req.params.orderId, function (err, order) {
    if (err) {
      res.send(err)
    } else {
      Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, { new: true }, function (err, order) {
        if (err) {
          res.send(err)
        } else {
          res.json(order)
        }
      })
    }
  })
}

exports.update_an_order = function (req, res) {
  // Check if the order has been previously assigned or not
  // Assign the order to the proper clerk that is requesting the assigment
  // when updating delivery moment it must be checked the clerk assignment
  // and to check if it is the proper clerk and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Order.findById(req.params.orderId, function (err, order) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, { new: true }, function (err, order) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.json(order)
        }
      })
    }
  })
}

exports.delete_an_order_v0 = function (req, res) {
  Order.deleteOne({
    _id: req.params.orderId
  }, function (err, order) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Order successfully deleted' })
    }
  })
}

exports.delete_an_order = function (req, res) {
  // Check if the order were delivered or not and delete it or not accordingly
  // Check if the user is the proper customer that posted the order and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Order.deleteOne({
    _id: req.params.orderId
  }, function (err, order) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Order successfully deleted' })
    }
  })
}
