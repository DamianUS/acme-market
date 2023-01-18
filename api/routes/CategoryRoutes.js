'use strict'
import { listCategories, createCategory, readCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

export default function (app) {

  app.route('/v0/categories')
    .get(listCategories)
    .post(createCategory)

  /*
  app.route('/v0/categories/:categId')
    .get(items.read_a_category)
    .put(items.update_a_category)
    .delete(items.delete_a_category)
  */
}