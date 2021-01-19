/**
 * Copyright Nicolas Zozol, Robusta Code 2021
 */
require('dotenv').config()
const {Logger, LogLevel} = require('plop-logger')
const ewelink = require('ewelink-api')
const shouldPowerOn = require('./dates')

const logger = Logger.getLogger("Work")
logger.level = LogLevel.Debug;

logger.info("Starting Application")

const devices = {
    lili: process.env.LILI
}

const connection = new ewelink({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    region: process.env.REGION // eu, us ....
})

let intervalId;
connection.getDevices().then(()=> {
    work()
    intervalId = setInterval(work, 10*60*1000)
})



async function work() {

    try {
        const {temperature, power} = await liliStatus()
        const conditions = JSON.stringify({temperature, power})

        if (shouldPowerOn('LILI', temperature)){
            if(!power) {
                logger.info(conditions+ " | Powering lili on");
                await connection.setDevicePowerState(devices.lili, 'on')
            }else{
                logger.info(conditions+ " | Nothing to do");
            }

        }else{
            if(power){
                logger.info(conditions+ " | Powering lili off");
                await connection.setDevicePowerState(devices.lili, 'off')
            }else{
                logger.info(conditions + " | Nothing to do");
            }
        }



    } catch (e) {
        logger.error('Error on work' + JSON.stringify(e))

    }
}



async function liliStatus() {
    const stringTemperature = (await connection.getDeviceCurrentTemperature(devices.lili)).temperature
    const stringPower = (await connection.getDevicePowerState(devices.lili)).state

    const temperature = parseFloat(stringTemperature)
    const power = stringPower ==='on';
    return {temperature, power}
}

async function powerLili() {
    await connection.setDevicePowerState(devices.lili, 'on')
    console.log("Lili powered on");
}

// You need to login first with an existing region, for exemple us/eu
//const region =connection.getRegion().then(console.log);
