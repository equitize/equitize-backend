const morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream'); // version 2.x

// create a rotating write stream
var retailInvAccessLogStream = rfs.createStream('access.log', {
    interval: '30s', // rotate 30s
    path: path.join(__dirname, 'logs/retailInvestor')
})

// custom tokens
morgan.token('id', function (req, res) { return req.params.id });
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

module.exports = {
    retailInvLogger : morgan('[:date[iso]] :method :url [ID::id] [PAYLOAD::body]', { stream: retailInvAccessLogStream })
}