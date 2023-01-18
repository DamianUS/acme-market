'use strict'
import { listIndicators, lastIndicator, createDataWareHouseJob, rebuildPeriod } from '../controllers/DataWareHouseController.js';

export default function (app) {
  /**
   * Get a list of all indicators or post a new computation period for rebuilding
   * RequiredRole: Administrator
   * @section dataWareHouse
   * @type get post
   * @url /dataWareHouse
   * @param [string] rebuildPeriod
  */
  app.route('/dataWareHouse')
    .get(listIndicators)
    .post(rebuildPeriod)

  /**
   * Get a list of last computed indicator
   * RequiredRole: Administrator
   * @section dataWareHouse
   * @type get
   * @url /dataWareHouse/latest
  */
  app.route('/dataWareHouse/latest')
    .get(lastIndicator)
}
