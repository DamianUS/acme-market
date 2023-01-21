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

const createOrder = async (req, res) => {
  // Check that user is a Customer and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newOrder = new Order(req.body)
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

const readOrder = async (req, res) => {
  Order.findById(req.params.orderId, (err, order) => {
    if (err) {
      res.send(err)
    } else {
      res.json(order)
    }
  })
}

const updateOrder = async (req, res) => {
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

const deleteOrder = async (req, res) => {
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

export { listOrders, createOrder, readOrder, updateOrder, deleteOrder }