var winston = require('winston'); // Winston to log file
var fs      = require('fs'); // File System to read files

fs.stat("./logs/", function (err, stats){
    if (err) { // If error create folder
        fs.mkdirSync('./logs');
    }else{
        if (!stats) { // If not folder stats create folder
            // This isn't a directory!
            fs.mkdirSync('./logs');
        }else{
            if(!stats.isDirectory()){ // If not type folder create folder
                fs.mkdirSync('./logs');
            }
        }
    }
});

// setup winston for Authentication logs
winston.loggers.add('auth', {
    transports: [
        // Setup your shared transports here for request log
        new(winston.transports.File)({
            name: 'auth-error.log',
            level: 'error',
            filename: './logs/auth-error.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
        new(winston.transports.File)({
            name: 'auth.log',
            level: 'info',
            filename: './logs/auth.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
    ]
});

// setup winston for Json patch logs
winston.loggers.add('patch', {
    transports: [
        // Setup your shared transports here for request log
        new(winston.transports.File)({
            name: 'patch-error.log',
            level: 'error',
            filename: './logs/patch-error.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
        new(winston.transports.File)({
            name: 'patch.log',
            level: 'info',
            filename: './logs/patch.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
    ]
});

// setup winston for image resizing logs
winston.loggers.add('resize', {
    transports: [
        // Setup your shared transports here for request log
        new(winston.transports.File)({
            name: 'resize-error.log',
            level: 'error',
            filename: './logs/resize-error.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
        new(winston.transports.File)({
            name: 'resize.log',
            level: 'info',
            filename: './logs/resize.log',
            datePattern: '.yyyy-MM-dd-HH',
        }),
    ]
});

// console removed from logging
winston.remove(winston.transports.Console);

// export modules 
module.exports.auth = winston.loggers.get('auth');
module.exports.patch = winston.loggers.get('patch');
module.exports.resize = winston.loggers.get('resize');
