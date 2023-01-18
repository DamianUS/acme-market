
import async from 'async'
import cron from 'cron'
import DataWareHouse from '../models/DataWareHouseModel.js'
import Order from '../models/OrderModel.js'

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

// '0 0 * * * *' una hora
// '*/30 * * * * *' cada 30 segundos
// '*/10 * * * * *' cada 10 segundos
// '* * * * * *' cada segundo
let period = '*/10 * * * * *' // El que se usará por defecto
let computeDataWareHouseJob

const rebuildPeriod = (req, res) => {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod)
  period = req.query.rebuildPeriod
  computeDataWareHouseJob.setTime(new cron.CronTime(period))
  computeDataWareHouseJob.start()

  res.json(req.query.rebuildPeriod)
}

const createDataWareHouseJob = () => {
  computeDataWareHouseJob = new cron.CronJob(period, () => {
    const newDataWareHouse = new DataWareHouse()
    console.log('Cron job submitted. Rebuild period: ' + period)
    //De esto creo que hay versión nativa, tengo que mirar
    async.parallel([
      computeTopCancellers,
      computeTopNotCancellers,
      computeBottomNotCancellers,
      computeTopClerks,
      computeBottomClerks,
      computeRatioCancelledOrders
    ], (err, results) => {
      if (err) {
        console.log('Error computing datawarehouse: ' + err)
      } else {
        // console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
        newDataWareHouse.topCancellers = results[0]
        newDataWareHouse.topNotCancellers = results[1]
        newDataWareHouse.bottomNotCancellers = results[2]
        newDataWareHouse.topClerks = results[3]
        newDataWareHouse.bottomClerks = results[4]
        newDataWareHouse.ratioCancelledOrders = results[5]
        newDataWareHouse.rebuildPeriod = period
        newDataWareHouse.save((err, datawarehouse) => {
          if (err) {
            console.log('Error saving datawarehouse: ' + err)
          } else {
            console.log('new DataWareHouse succesfully saved. Date: ' + new Date())
          }
        })
      }
    })
  }, null, true, 'Europe/Madrid')
}

const computeTopCancellers = (callback) => {
  Order.aggregate([
    { $match: { cancelationMoment: { $exists: true } } },
    {
      $facet: {
        preComputation: [
          { $group: { _id: '$consumer', ordersCanceled: { $sum: 1 } } },
          { $group: { _id: null, nCanceladores: { $sum: 1 } } },
          { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ['$nCanceladores', 0.1] } } } }
        ],
        canceladores: [{ $project: { _id: 0, consumer: 1 } }, { $group: { _id: '$consumer', ordersCanceled: { $sum: 1 } } }, { $sort: { ordersCanceled: -1 } }]
      }
    },
    { $project: { topCanceladores: { $slice: ['$canceladores', { $arrayElemAt: ['$preComputation.limitTopPercentage', 0] }] } } }
  ], (err, res) => {
    callback(err, res[0].topCanceladores)
  })
};

const computeTopNotCancellers = (callback) => {
  Order.aggregate([
    { $match: { cancelationMoment: { $exists: false } } },
    {
      $facet: {
        preComputation: [
          { $group: { _id: '$consumer', ordersNotCanceled: { $sum: 1 } } },
          { $group: { _id: null, nNoCanceladores: { $sum: 1 } } },
          { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ['$nNoCanceladores', 0.1] } } } }
        ],
        noCanceladores: [{ $project: { _id: 0, consumer: 1 } }, { $group: { _id: '$consumer', ordersNotCanceled: { $sum: 1 } } }, { $sort: { ordersNotCanceled: -1 } }]
      }
    },
    { $project: { topNoCanceladores: { $slice: ['$noCanceladores', { $arrayElemAt: ['$preComputation.limitTopPercentage', 0] }] } } }
  ], (err, res) => {
    callback(err, res[0].topNoCanceladores)
  })
};

const computeBottomNotCancellers = (callback) => {
  Order.aggregate([
    { $match: { cancelationMoment: { $exists: false } } },
    {
      $facet: {
        preComputation: [
          { $group: { _id: '$consumer', ordersNotCanceled: { $sum: 1 } } },
          { $group: { _id: null, nNoCanceladores: { $sum: 1 } } },
          { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ['$nNoCanceladores', 0.1] } } } }
        ],
        noCanceladores: [{ $project: { _id: 0, consumer: 1 } }, { $group: { _id: '$consumer', ordersNotCanceled: { $sum: 1 } } }, { $sort: { ordersNotCanceled: 1 } }]
      }
    },
    { $project: { bottomNoCanceladores: { $slice: ['$noCanceladores', { $arrayElemAt: ['$preComputation.limitTopPercentage', 0] }] } } }
  ], (err, res) => {
    callback(err, res[0].bottomNoCanceladores)
  })
};

const computeTopClerks = (callback) => {
  Order.aggregate([
    { $match: { deliveryMoment: { $exists: true } } },
    {
      $facet: {
        preComputation: [
          { $group: { _id: '$clerk', ordersDelivered: { $sum: 1 } } },
          { $group: { _id: null, nDeliverers: { $sum: 1 } } },
          { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ['$nDeliverers', 0.1] } } } }
        ],
        deliverers: [{ $project: { _id: 0, clerk: 1 } }, { $group: { _id: '$clerk', ordersDelivered: { $sum: 1 } } }, { $sort: { ordersDelivered: -1 } }]
      }
    },
    { $project: { topDeliverers: { $slice: ['$deliverers', { $arrayElemAt: ['$preComputation.limitTopPercentage', 0] }] } } }
  ], (err, res) => {
    callback(err, res[0].topDeliverers)
  })
};

const computeBottomClerks = (callback) => {
  Order.aggregate([
    { $match: { deliveryMoment: { $exists: true } } },
    {
      $facet: {
        preComputation: [
          { $group: { _id: '$clerk', ordersDelivered: { $sum: 1 } } },
          { $group: { _id: null, nDeliverers: { $sum: 1 } } },
          { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ['$nDeliverers', 0.1] } } } }
        ],
        deliverers: [{ $project: { _id: 0, clerk: 1 } }, { $group: { _id: '$clerk', ordersDelivered: { $sum: 1 } } }, { $sort: { ordersDelivered: 1 } }]
      }
    },
    { $project: { bottomDeliverers: { $slice: ['$deliverers', { $arrayElemAt: ['$preComputation.limitTopPercentage', 0] }] } } }
  ], (err, res) => {
    callback(err, res[0].bottomDeliverers)
  })
};

const computeRatioCancelledOrders = (callback) => {
  Order.aggregate([
    {
      $project: {
        placementMonth: { $month: '$placementMoment' },
        placementYear: { $year: '$placementMoment' },
        cancelationMoment: 1
      }
    },
    {
      $match: {
        placementMonth: new Date().getMonth() + 1,
        placementYear: new Date().getFullYear()
      }
    },
    {
      $facet: {
        totalOrdersCurrentMonth: [{ $group: { _id: null, totalOrders: { $sum: 1 } } }],
        totalCancelledOrdersCurrentMonth: [
          { $match: { cancelationMoment: { $exists: true } } },
          { $group: { _id: null, totalOrders: { $sum: 1 } } }]
      }
    },

    { $project: { _id: 0, ratioOrdersCancelledCurrentMont: { $divide: [{ $arrayElemAt: ['$totalCancelledOrdersCurrentMonth.totalOrders', 0] }, { $arrayElemAt: ['$totalOrdersCurrentMonth.totalOrders', 0] }] } } }
  ], (err, res) => {
    if (res?.length > 0) {
      callback(err, res[0]?.ratioOrdersCancelledCurrentMont)
    } else {
      callback(err, res)
    }
  })
};

export { listIndicators, lastIndicator, createDataWareHouseJob, rebuildPeriod }
