'use strict'
import { listOrders, listMyOrders, createOrderV0, createOrder, readOrder, updateOrderV0, updateOrder, deleteOrderV0, deleteOrder, searchOrders } from '../controllers/OrderController.js' 
import { creationValidator } from '../controllers/validators/OrderValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'
export default function (app) {

  app.route('/v0/orders')
    .get(listOrders)
    .post(createOrderV0)

  /**
   * Post an order
   *    RequiredRoles: to be a customer
   *
   * @section orders
   * @type get post
   * @url /v1/orders
  */
  app.route('/v1/orders')
  // .get(order.list_all_orders)
    .post(
      creationValidator,
      handleExpressValidation,
      createOrder
      )

  /**
   * Search engine for orders
   * Get orders depending on params
   *    RequiredRoles: Clerk
   *
   * @section orders
   * @type get
   * @url /v1/orders/search
   * @param {string} clerkId //if it is null we will include the non assigned orders
   * @param {string} delivered (true|false)
   * @param {string} cancelled (true|false)
   * @param {string} sortedBy (total)
   * @param {string} reverse (true|false)
   * @param {string} startFrom
   * @param {string} pageSize
  */
  app.route('/v1/orders/search')
    .get(searchOrders)

  app.route('/v0/orders/:orderId')
    .get(readOrder)
    .put(updateOrderV0)
    .delete(deleteOrderV0)

  /**
   * Delete an order if it is not delivered
   *    RequiredRoles: to be the customer that posted the order
   * Put an order with the proper clerk assignment (only if the order has not previously assigned);
   * also to update the delivery moment.
   *    RequiredRoles: clerk
   * Get an specific order.
   *    RequiredRoles: to be a proper customer
   *
   * @section orders
   * @type put delete
   * @url /v1/orders/:orderId
  */
  app.route('/v1/orders/:orderId')
    .get(readOrder)
    .put(updateOrder)
    .delete(deleteOrder)

  /**
  * Get my orders.
  *    RequiredRoles: to be a proper customer
  *
  * @section myorders
  * @type get
  * @url /v1/myorders/ ¿:actorId?
  */
  app.route('/v1/myorders')
    .get(listMyOrders) // add ownership for CONSUMER
}
