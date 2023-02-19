
import DataWareHouse from '../models/DataWareHouseModel.js'
import { restartDataWarehouseJob } from '../services/DataWarehouseService.js'

const listIndicators = (req, res) => {
  try{
    const indicators = DataWareHouse.find().sort('-computationMoment').exec()
    res.json(indicators)
  }
  catch(err){
    res.send(err)
  }
}

const lastIndicator = (req, res) => {
  try {
    const indicator = DataWareHouse.find().sort('-computationMoment').limit(1).exec()
    res.json(indicator)
  }
  catch (err) {
    res.send(err)
  }
}

const rebuildPeriod = (req, res) => {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod)
  period = req.query.rebuildPeriod
  restartDataWarehouseJob(period)
  res.json(req.query.rebuildPeriod)
}

export { listIndicators, lastIndicator, rebuildPeriod }
