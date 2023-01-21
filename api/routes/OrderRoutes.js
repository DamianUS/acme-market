'use strict'
import { listOrders, createOrder, readOrder, updateOrder, deleteOrder } from '../controllers/OrderController.js' 

export default function (app) {

  app.route('/orders')
    .get(listOrders)
    .post(createOrder)

  app.route('/orders/:orderId')
    .get(readOrder)
    .put(updateOrder)
    .delete(deleteOrder)

}
