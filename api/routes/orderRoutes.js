'use strict'
module.exports = function (app) {
  const order = require('../controllers/orderController')

  app.route('/v0/orders')
    .get(order.list_all_orders)
    .post(order.create_an_order_v0)

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
    .post(order.create_an_order)

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
    .get(order.search_orders)

  app.route('/v0/orders/:orderId')
    .get(order.read_an_order)
    .put(order.update_an_order_v0)
    .delete(order.delete_an_order_v0)

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
    .get(order.read_an_order)
    .put(order.update_an_order)
    .delete(order.delete_an_order)

  /**
  * Get my orders.
  *    RequiredRoles: to be a proper customer
  *
  * @section myorders
  * @type get
  * @url /v1/myorders/ ¿:actorId?
  */
  app.route('/v1/myorders')
    .get(order.list_my_orders) // add ownership for CONSUMER
}
