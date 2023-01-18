'use strict'
import { listItemsV0, listItems, createItem, createItemV0, readItem, updateItemV0, updateItem, deleteItemV0, deleteItem, searchItems } from '../controllers/ItemController.js';

export default function (app) {

  app.route('/v0/items')
    .get(listItemsV0)
    .post(createItemV0)

  /**
   * Manage catalogue of items:
   * Post items
   *    RequiredRoles: Administrator
   * Get items
   *    RequiredRoles: Administrator
   *
   * @section items
   * @type put
   * @url /v1/items
  */
  app.route('/v1/items')
    .get(listItems)
    .post(createItem)

  app.route('/v0/items/:itemId')
    .get(readItem)
    .put(updateItemV0)
    .delete(deleteItemV0)

  /**
   * get results from a search of items groupBy category
   *    RequiredRoles: None
   *
   * @section items
   * @type get
   * @url /v1/items/search
   * @param {string} itemName
   * @param {string} categoryId (categoryId)
   * @param {string} deleted (true|false)
   * @param {string} startFrom
   * @param {string} pageSize
   * @param {string} sortedBy (category)
   * @param {string} reverse (true|false)
   * @param {string} keyword //in sku, name, or description
   */
  app.route('/v1/items/search')
    .get(searchItems)

  /**
   * Put comments on an item or update it
   *    RequiredRoles: any (comment); administrator if any other update
   * Delete an item
   *    RequiredRoles: Administrator
   * Get an item
   *    RequiredRoles: any
   *
   * @section items
   * @type get put delete
   * @url /v1/items/:itemId
  */
  app.route('/v1/items/:itemId')
    .get(readItem)
    .put(updateItem)
    .delete(deleteItem)

}