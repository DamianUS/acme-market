import async from 'async'
import Order from '../models/OrderModel.js'
import cron from 'cron'
import DataWareHouse from '../models/DataWareHouseModel.js'

// '0 0 * * * *' una hora
// '*/30 * * * * *' cada 30 segundos
// '*/10 * * * * *' cada 10 segundos
// '* * * * * *' cada segundo
let defaultPeriod = '*/10 * * * * *' // El que se usará por defecto
let dataWarehouseJob

const buildNewDataWarehouse = (resultsDataWarehouse, period) => {
    const newDataWareHouse = new DataWareHouse()
    const [topCancellers, topNotCancellers, bottomNotCancellers, topClerks, bottomClerks, ratioCancelledOrders] = resultsDataWarehouse
    newDataWareHouse.topCancellers = topCancellers
    newDataWareHouse.topNotCancellers = topNotCancellers
    newDataWareHouse.bottomNotCancellers = bottomNotCancellers
    newDataWareHouse.topClerks = topClerks
    newDataWareHouse.bottomClerks = bottomClerks
    newDataWareHouse.ratioCancelledOrders = ratioCancelledOrders
    newDataWareHouse.rebuildPeriod = period
    return newDataWareHouse
}

const initializeDataWarehouseJob = () => {
    dataWarehouseJob = new cron.CronJob(defaultPeriod, async () => {
        console.log('Cron job submitted. Rebuild period: ' + defaultPeriod)
        try{
            const dataWarehouseResults = await Promise.all([
                computeTopCancellers(),
                computeTopNotCancellers(),
                computeBottomNotCancellers(),
                computeTopClerks(),
                computeBottomClerks(),
                computeRatioCancelledOrders()
            ])
            const newDataWareHouse = buildNewDataWarehouse(dataWarehouseResults, defaultPeriod)
            try{
                newDataWareHouse.save()
                console.log('new DataWareHouse succesfully saved. Date: ' + new Date())
            }
            catch(err){
                console.log('Error saving datawarehouse: ' + err)
            }
        }
        catch(err){
            console.log('Error computing datawarehouse: ' + err)
        }
    }, null, true, 'Europe/Madrid')
}

const restartDataWarehouseJob = (period) => {
    defaultPeriod = period
    dataWarehouseJob.setTime(new cron.CronTime(period))
    dataWarehouseJob.start()
}

const computeTopCancellers = async () => {
    const respuestaFacetArrayTopCanceladores = await Order.aggregate([
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
    ])
    return respuestaFacetArrayTopCanceladores[0].topCanceladores
}

const computeTopNotCancellers = async () => {
    const respuestaFacetArrayTopNoCanceladores = await Order.aggregate([
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
    ])
    return respuestaFacetArrayTopNoCanceladores[0].topNoCanceladores
}

const computeBottomNotCancellers = async () => {
    const respuestaFacetArrayBottomNoCanceladores = await Order.aggregate([
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
    ])
    return respuestaFacetArrayBottomNoCanceladores[0].bottomNoCanceladores
}

const computeTopClerks = async () => {
    const respuestaFacetArrayTopClerks = await Order.aggregate([
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
    ])
    return respuestaFacetArrayTopClerks[0].topDeliverers
}

const computeBottomClerks = async () => {
    const respuestaFacetArrayBottomClerks = await Order.aggregate([
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
    ])
    return respuestaFacetArrayBottomClerks[0].bottomDeliverers
}

const computeRatioCancelledOrders = async () => {
    const respuestaFacetArrayRatioCancelledOrders = await Order.aggregate([
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
    ])
    //Puede no haber pedidos cancelados
    const ratio = respuestaFacetArrayRatioCancelledOrders && respuestaFacetArrayRatioCancelledOrders.length > 0 && respuestaFacetArrayRatioCancelledOrders[0] ? respuestaFacetArrayRatioCancelledOrders[0].ratioOrdersCancelledCurrentMont : null
    return ratio
}

export { initializeDataWarehouseJob, restartDataWarehouseJob }