const winston = require('winston');
const dotenv = require('dotenv');
require('dotenv').config();

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        http: 'cyan',
        info: 'blue',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console({
            level: 'debug', 
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './devLoggerErrors.log',
            level: 'info',
            format: winston.format.simple()
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './prodLoggerErrors.log',
            level: 'info',
            format: winston.format.simple()
        })
    ]
});

const environment = 'PRODUCTION';

const Logger = (req, res, next) => {
    if (environment === 'DEVELOPMENT') {
        console.log("entre dev")
        req.logger = devLogger;
    } else if (environment === 'PRODUCTION') {
        console.log("entre productio")
        req.logger = prodLogger;
    }
    next();
};

module.exports = {
    Logger
};
