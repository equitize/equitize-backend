const express = require("express");
const createHttpError = require("http-errors");
const multer = require("multer");
// // const helpers = require("./cloudStorage/helpers/helpers");
// // const getSignedURL = require("./cloudStorage/helpers/helpers");

const cors = require("cors");
const app = express();
require('dotenv').config({
  path: `${__dirname}/.env`
});


var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));


// // for public routes
// // TODO: implement view engine for admin dashboard if there is time
app.use('/', require('./routes/index.route'));


const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // limt : 5mb
    fileSize: 10 * 1024 * 1024,
  },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// // db
const db = require("./db/models");
db.sequelize.sync({ force: true, logging:false }).then((res) => {
  console.log("Drop and re-sync db.");
}).catch( function (error) {
  throw(error)
});


app.use('/api/db/startup', require('./db/routes/startup.routes'));
app.use('/api/db/retailInvestors', require('./db/routes/retailInvestors.routes'));
app.use('/api/db/campaign', require('./db/routes/campaign.routes'));
app.use('/api/db/junctionTable', require('./db/routes/junctionTable.routes'));
app.use('/api/db/general', require('./db/routes/general.routes'));

/** Error Handlers */
// 404
app.use((error, req, res, next) => {
  next(createHttpError.NotFound());
});
// // other errors
app.use((error, req, res, next) => {
  error.status = error.status || 500
  res.status(error.status);
  res.send(error);
});


// // set port, listen for requests
const DEV_PORT = process.env.DEV_PORT || 8080;

if (process.env.NODE_ENV == 'test') {
  module.exports = app;
}
else if (process.env.NODE_ENV == 'prod') {
  app.listen(process.env.PORT, "0.0.0.0" , () => {
    console.log(`Server is running on port. ${process.env.PORT}`);
  });
}
else if (process.env.NODE_ENV == 'dev') {
  app.listen(DEV_PORT, () => {
    console.log(`Server is running on port ${DEV_PORT}.`);
  });
}
