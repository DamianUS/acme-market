
import DataWareHouse from '../models/DataWareHouseModel.js'
import { restartDataWarehouseJob } from '../services/DataWarehouseServiceProvider.js'

const listIndicators = async (req, res) => {
  try{
    const indicators = await DataWareHouse.find().sort('-computationMoment').exec()
    res.json(indicators)
  }
  catch(err){
    res.send(err)
  }
}

const lastIndicator = async (req, res) => {
  try {
    const indicator = await DataWareHouse.find().sort('-computationMoment').limit(1).exec()
    res.json(indicator)
  }
  catch (err) {
    res.send(err)
  }
}

const rebuildPeriod = (req, res) => {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod)
  const period = req.query.rebuildPeriod
  restartDataWarehouseJob(period)
  res.json(req.query.rebuildPeriod)
}

export { listIndicators, lastIndicator, rebuildPeriod }
