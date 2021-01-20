/**
 * Copyright Nicolas Zozol, Robusta Code 2021
 */
require('dotenv').config()

const {appLogger} = require('../logger/logger-factory')

const ewelink = require('ewelink-api')
const shouldPowerOn = require('./dates')

appLogger.info('Starting Application')

const devices = {
    lili: process.env.LILI
}

let connection = createConnection()

// connection will return null values after a few hours
function createConnection() {
    return new ewelink({
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        region: process.env.REGION // eu, us ....
    })
}

let intervalId
connection.getDevices().then(() => {
    work()
    intervalId = setInterval(work, 10 * 60 * 1000)
})


async function work() {

    try {
        const {temperature, power} = await liliStatus()
        const conditions = JSON.stringify({temperature, power})

        if (temperature === null || !(temperature > 10)) {
            appLogger.warn('Temperature is null, reloading connection', temperature, conditions)
            connection = createConnection()
        }

        if (shouldPowerOn('LILI', temperature)) {
            if (!power) {
                appLogger.info(conditions + ' | Powering lili on')
                await connection.setDevicePowerState(devices.lili, 'on')
            } else {
                appLogger.info(conditions + ' | Nothing to do')
            }

        } else {
            if (power) {
                appLogger.info(conditions + ' | Powering lili off')
                await connection.setDevicePowerState(devices.lili, 'off')
            } else {
                appLogger.info(conditions + ' | Nothing to do')
            }
        }

    } catch (e) {
        appLogger.error('Error on work' + JSON.stringify(e))
    }
}


async function liliStatus() {
    const stringTemperature = (await connection.getDeviceCurrentTemperature(devices.lili)).temperature
    const stringPower = (await connection.getDevicePowerState(devices.lili)).state

    const temperature = parseFloat(stringTemperature)
    const power = (stringPower === 'on')
    if (typeof temperature !== "number"){
        appLogger.warn('Tempearature is no more a number: '+temperature )
    }
    return {temperature, power}
}

async function powerLili() {
    await connection.setDevicePowerState(devices.lili, 'on')
    console.log('Lili powered on')
}

// You need to login first with an existing region, for exemple us/eu
//const region =connection.getRegion().then(console.log);
