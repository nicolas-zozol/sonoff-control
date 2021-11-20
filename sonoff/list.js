/**
 * Copyright Nicolas Zozol, Robusta Code 2021
 * Will list the device ids by name
 */
require('dotenv').config()

const {appLogger} = require('../logger/logger-factory')

const ewelink = require('ewelink-api')

appLogger.info('Starting Application')


let connection = createConnection()

// connection will return null values after a few hours
function createConnection() {
  return new ewelink({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    region: process.env.REGION // eu, us ....
  })
}

connection.getDevices().then((data) => {
  console.log(data.map(d=>({
    id:d.deviceid,
    name:d.name
  })))
})