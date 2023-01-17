'use strict'
module.exports = function (app) {
  const dataWareHouse = require('../controllers/dataWareHouseController')

  /**
   * Get a list of all indicators or post a new computation period for rebuilding
   * RequiredRole: Administrator
   * @section dataWareHouse
   * @type get post
   * @url /dataWareHouse
   * @param [string] rebuildPeriod
  */
  app.route('/dataWareHouse')
    .get(dataWareHouse.list_all_indicators)
    .post(dataWareHouse.rebuildPeriod)

  /**
   * Get a list of last computed indicator
   * RequiredRole: Administrator
   * @section dataWareHouse
   * @type get
   * @url /dataWareHouse/latest
  */
  app.route('/dataWareHouse/latest')
    .get(dataWareHouse.last_indicator)
}
