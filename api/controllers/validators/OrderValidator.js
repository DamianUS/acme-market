import { check } from 'express-validator'
import Actor from '../../models/ActorModel.js'
import Item from '../../models/ItemModel.js'

const _checkCustomerNameValid = async (value, { req }) => {
  try {
    const customer = await Actor.findById(req.body.consumer)
    if (customer === null || !customer.role.includes("CUSTOMER")) {
      return Promise.reject(new Error('Customer does not exist'))
    } 
    else if(value !== customer.name) {
      return Promise.reject(new Error('Customer name does not match'))
    }
    else {
      return Promise.resolve('Customer name ok')
    }
  } catch (err) {
    return Promise.reject(err)
  }
} 

const _checkTotalValid = async (value, { req }) => {
  const orderedItemsTotal = req.body.orderedItems
  .map(orderedItem => orderedItem.quantity * orderedItem.price)
  .reduce((accumulator, currentSubTotal) => accumulator + currentSubTotal, 0.0)
  //Both should be float so === should work, applying weak restriction here
  if (orderedItemsTotal == value){
    return Promise.resolve('Totals ok')
  }
  else{
    return Promise.reject(new Error('Totals do not match'))
  }
}

const _checkSkuAndNameExistAndMatch = async (value, { req })  => {
  const iPhoneX = await Item.findOne({ sku: 'bVsHaq', name: 'iPhone X' }).exec()
  //3 options to implement: 1) sequential awaits for each orderedItem, 2) Parallelize 1), 3) It can be done with only one query. Excercise!
  const findItemPromises = value // es igual que req.body.orderedItems
  .map(orderedItem => Item.findOne({ sku: orderedItem.sku, name: orderedItem.name}).exec())
  try{
    const items = await Promise.all(findItemPromises)
    if (items.filter(item => item)?.length !== req.body.orderedItems.length){
      return Promise.reject(new Error('At least one ordered item could not be found'))
    }
    else{
      return Promise.resolve('Ordered items ok')
    }
  }
  catch(err){
    return Promise.reject(err)
  }
}

const creationValidator = [
  check('consumerName').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
  check('consumer').exists({ checkNull: true, checkFalsy: true }).isMongoId().trim().escape(),
  check('consumerName')
  .custom(_checkCustomerNameValid),
  check('orderedItems').exists({ checkNull: true, checkFalsy: true }).isArray(),
  check('orderedItems').custom((value, { req }) => value.length > 0).withMessage("At least one item is required"),
  check('orderedItems.*.quantity').exists({ checkNull: true, checkFalsy: true }).isInt({ min: 1 }),
  check('orderedItems.*.price').exists({ checkNull: true }).isNumeric().toFloat(),
  check('orderedItems.*.name').exists({ checkNull: true, checkFalsy: true }).isString().trim().escape(),
  check('orderedItems').custom(_checkSkuAndNameExistAndMatch),
  check('total').exists({ checkNull: true, checkFalsy: true }).isNumeric().toFloat(),
  check('total').custom(_checkTotalValid).withMessage("Totals don't match"),
]

export { creationValidator }
