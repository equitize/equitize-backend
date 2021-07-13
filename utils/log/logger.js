const morgan = require('morgan');
const retailInvLogService = require('../../db/services/retailInvLog.service');
var path = require('path');
// var rfs = require('rotating-file-stream'); // version 2.x

// create a rotating write stream
// var retailInvAccessLogStream = rfs.createStream('access.log', {
//     interval: '1d', // rotate 30s
//     path: path.join(__dirname, 'logs/retailInvestor')
// })


var sqlCloudStream = (message) => {
    retailInvLog = { log : message }
    retailInvLogService.create(retailInvLog)
}

// custom tokens
morgan.token('id', function (req, res) { return req.params.id });
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

module.exports = {
    // retailInvLogger : morgan('[:date[iso]] :method :url [ID::id] [PAYLOAD::body]', { stream: retailInvAccessLogStream })
    retailInvLogger : morgan('[:date[iso]] :method :url [ID::id] [PAYLOAD::body]', { 
        stream: { 
            write: (message) => {sqlCloudStream(message)}
        }
    })
}    