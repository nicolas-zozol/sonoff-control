const {Logger, LogLevel, logLevel} = require('plop-logger')
var FileAppender = require('./file-appender')

Logger.config.appender = new FileAppender('plop.log')

var rules = require('../rules/rules.json')

const loggers = {}

const appLogger = createAppLogger()
createAllLoggers(rules)

function createAppLogger() {
    const name = 'APP'
    const logger = Logger.getLogger(name)
    logger.level = LogLevel.Info
    loggers[name] = logger
    logger.info('APP logger created')
    return logger
}

function createAllLoggers(rules) {
    rules.forEach(r => createLogger(r.name, logLevel(r.logLevel) || LogLevel.Info))
    appLogger.info('All loggers created')
}

function createLogger(name, level) {
    const logger = Logger.getLogger(name)
    logger.level = level
    loggers[name] = logger
}


function getLogger(name) {

    if (loggers[name]) {
        return loggers [name]
    }
    return appLogger
}

module.exports = {
    appLogger,
    getLogger
}