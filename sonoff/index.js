/**
 * Copyright Nicolas Zozol, Robusta Code 2021
 */
require('dotenv').config();

const {appLogger} = require('../logger/logger-factory');

const ewelink = require('ewelink-api');
const shouldPowerOn = require('./dates');
var rules = require('../rules/rules.json');

const shouldPowerOnNoTemperature = require('./date-notemp');

appLogger.info('Starting Application');

const devices = JSON.parse(process.env.DEVICES);
appLogger.debug('devices environment:', devices);

function deviceRulesByName(name) {
  return rules.find(r => r.name === name);
}

let connection = createConnection();

// connection will return null values after a few hours
function createConnection() {
  return new ewelink({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    region: process.env.REGION // eu, us ....
  });
}

let intervalId;
connection.getDevices().then(() => {
  // Important :connection.getDevices() returns an array of devices, but we are not using this object now
  // we are using env variable : DEVICES=[{"name":"KITCHEN","id":"10006abdcde"},{"name":"BEDROOM","id":"10010abcde"}]
  devices.forEach(device => {
    const {name, id} = device;
    work(id, name);
    intervalId = setInterval(() => work(id, name), 10 * 60 * 1000);
  });

});


async function work(deviceId, deviceName) {

  try {
    const {temperature, power} = await deviceStatus(deviceId);
    const conditions = JSON.stringify({temperature, power});
    const devicesRules = deviceRulesByName(deviceName);

    // Happens sometimes with bad connection
    const unsetTemperature = temperature === null || temperature === undefined || temperature < 1;

    if (devicesRules.temperature && unsetTemperature) {
      appLogger.warn('Temperature is null, reloading connection', temperature, conditions);
      connection = createConnection();
    }

    const shouldPower = devicesRules.temperature ?
      shouldPowerOn(deviceName, temperature) :
      shouldPowerOnNoTemperature(deviceName);

    if (shouldPower) {
      if (!power) {
        appLogger.info(`${deviceName}: ${conditions}  | Powering ON`);
        await connection.setDevicePowerState(deviceId, 'on');
      } else {
        appLogger.debug(`${deviceName}: ${conditions}  |  Nothing to do`);
      }

    } else {
      if (power) {
        appLogger.info(`${deviceName}: ${conditions}  | Powering OFF`);
        await connection.setDevicePowerState(deviceId, 'off');
      } else {
        appLogger.debug(conditions + ' | Nothing to do');
      }
    }

  } catch (e) {
    appLogger.error('Error on work' + JSON.stringify(e));
  }
}


async function deviceStatus(deviceId) {
  const stringTemperature = (await connection.getDeviceCurrentTemperature(deviceId)).temperature;
  const stringPower = (await connection.getDevicePowerState(deviceId)).state;

  const temperature = parseFloat(stringTemperature);
  const power = (stringPower === 'on');
  if (typeof temperature !== "number") {
    appLogger.warn('Temperature is no more a number: ' + temperature);
  }
  return {temperature, power};
}


// You need to login first with an existing region, for exemple us/eu
//const region =connection.getRegion().then(console.log);
