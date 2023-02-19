import * as AsyncDataWarehouseService from './AsyncDataWarehouseService.js'
import * as PromiseDataWarehouseService from './PromiseDataWarehouseService.js'

//Esta implementación por defecto podría estar en un .env/config.js o en una colección dentro de la base de datos 
const defaultImplementation = 'promise'

const initializeDataWarehouseJob = () => {
    if (defaultImplementation === 'async')
        return AsyncDataWarehouseService.initializeDataWarehouseJob()
    return PromiseDataWarehouseService.initializeDataWarehouseJob()
}

const restartDataWarehouseJob = (period) => {
    if (defaultImplementation === 'async')
        return AsyncDataWarehouseService.restartDataWarehouseJob(period)
    return PromiseDataWarehouseService.restartDataWarehouseJob(period)
}


export { initializeDataWarehouseJob, restartDataWarehouseJob }
