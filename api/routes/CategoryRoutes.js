'use strict'
import { listCategories, createCategory, readCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

export default function (app) {

  app.route('/categories')
    .get(listCategories)
    .post(createCategory)
  
  app.route('/categories/:categId')
    .get(readCategory)
    .put(updateCategory)
    .delete(deleteCategory)

}