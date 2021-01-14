/**
 * Copyright Nicolas Zozol, Robusta Code 2021
 */
require('dotenv').config()
const ewelink = require('ewelink-api')
const shouldPowerOn = require('./dates')


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

        if (shouldPowerOn('LILI', temperature)){
            if(!power) {
                console.log({temperature, power}, "Powering lili on");
                await connection.setDevicePowerState(devices.lili, 'on')
            }else{
                console.log({temperature, power},"Nothing to do");
            }

        }else{
            if(power){
                console.log({temperature, power},"Powering lili off");
                await connection.setDevicePowerState(devices.lili, 'off')
            }else{
                console.log({temperature, power},"Nothing to do");
            }
        }



    } catch (e) {
        console.error(e)
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
