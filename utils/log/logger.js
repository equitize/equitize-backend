const morgan = require('morgan');
const retailInvLogService = require('../../db/services/retailInvLog.service');

var sqlCloudStream = (message) => {
    retailInvLog = { log : message }
    retailInvLogService.create(retailInvLog)
}

// custom tokens
morgan.token('id', function (req, res) { return req.params.id });
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

module.exports = {
    retailInvLogger : morgan('[:date[iso]] :method :url [ID::id] [PAYLOAD::body]', { 
        stream: { 
            write: (message) => {sqlCloudStream(message)}
        }
    })
}    