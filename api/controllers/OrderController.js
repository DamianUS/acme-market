'use strict'
import Order from '../models/OrderModel.js'

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
    res.json(orders)
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const listMyOrders = async (req, res) => {
  //TODO: This doesn't make sense right now, but we need Firebase to provide the logged in user
  Order.find({}, (err, orders) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(orders)
    }
  })
}

const createOrderV0 = async (req, res) => {
  const newOrder = new Order(req.body)
  try {
    const order = await newOrder.save()
    res.json(order)
  }
  catch (err) {
    res.send(err)
  }
}

const createOrder = async (req, res) => {
  // Check that user is a Customer and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newOrder = new Order(req.body)
  // No tiene sentido que se pida al front-end el consumer name
  try {
    const order = await newOrder.save()
    res.json(order)
  }
  catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const _generate_query_object = (req) => {
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
  return query
}

const searchOrders = async (req, res) => {
  const query = _generate_query_object(req)
  const skip = req.query.startFrom ? parseInt(req.query.startFrom) : 0
  const limit = req.query.pageSize ? parseInt(req.query.pageSize) : 0
  let sort = req.query.reverse === 'true' ? '-' : ''
  if (req.query.sortedBy) {
    sort += req.query.sortedBy
  }
  console.log('Query: ' + query + ' Skip:' + skip + ' Limit:' + limit + ' Sort:' + sort)
  try {
    const orders = await Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
    res.json(orders)
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const readOrder = async (req, res) => {
  Order.findById(req.params.orderId, (err, order) => {
    if (err) {
      res.send(err)
    } else {
      res.json(order)
    }
  })
}

const updateOrderV0 = async (req, res) => {
  Order.findById(req.params.orderId, (err, order) => {
    if (err) {
      res.send(err)
    } else {
      Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, { new: true }, (err, order) => {
        if (err) {
          res.send(err)
        } else {
          res.json(order)
        }
      })
    }
  })
}

const updateOrder = async (req, res) => {
  // Check if the order has been previously assigned or not
  // Assign the order to the proper clerk that is requesting the assigment
  // when updating delivery moment it must be checked the clerk assignment
  // and to check if it is the proper clerk and if not: res.status(403);
  // "an access token is valid, but requires more privileges
  try{
    const order = await Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, { new: true })
    if (order) {
      res.json(order)
    }
    else {
      res.status(404).send("Order not found")
    }
  }
  catch(err){
    res.status(500).send(err)
  }
}

const deleteOrderV0 = async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.orderId })
    res.json({ message: 'Order successfully deleted' })
  }
  catch (err) {
    res.send(err)
  }
}

const deleteOrder = async (req, res) => {
  // Check if the order were delivered or not and delete it or not accordingly
  // Check if the user is the proper customer that posted the order and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try {
    const deletionResponse = await Order.deleteOne({ _id: req.params.orderId })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Order successfully deleted' })
    }
    else {
      res.status(404).send("Order could not be deleted")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export { listOrders, listMyOrders, createOrderV0, createOrder, readOrder, updateOrderV0, updateOrder, deleteOrderV0, deleteOrder, searchOrders }