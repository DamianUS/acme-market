'use strict'
import { listItems, createItem, readItem, updateItem, deleteItem } from '../controllers/ItemController.js';

export default function (app) {

  app.route('/items')
    .get(listItems)
    .post(createItem)

  app.route('/items/:itemId')
    .get(readItem)
    .put(updateItem)
    .delete(deleteItem)

}