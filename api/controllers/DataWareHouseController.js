
import DataWareHouse from '../models/DataWareHouseModel.js'
import { restartDataWarehouseJob } from '../services/DataWarehouseService.js'

const listIndicators = (req, res) => {
  DataWareHouse.find().sort('-computationMoment').exec((err, indicators) => {
    if (err) {
      res.send(err)
    } else {
      res.json(indicators)
    }
  })
}

const lastIndicator = (req, res) => {
  DataWareHouse.find().sort('-computationMoment').limit(1).exec((err, indicators) => {
    if (err) {
      res.send(err)
    } else {
      res.json(indicators)
    }
  })
}

const rebuildPeriod = (req, res) => {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod)
  period = req.query.rebuildPeriod
  restartDataWarehouseJob(period)
  res.json(req.query.rebuildPeriod)
}

export { listIndicators, lastIndicator, rebuildPeriod }
