const express = require("express");
const multer = require("multer");
const cors = require("cors");
const logger = require("./utils/log/logger");
const app = express();
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'dev-persistent') {
  require('dotenv').config({
    path: `${__dirname}/.env`
  });
}
var corsOptions = {
  origin: "*"
};

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // limt : 30mb
    fileSize: 30 * 1024 * 1024,
  },
});

app.use(cors(corsOptions));
app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cron = require("node-cron");
const cronJobs = require("./utils/cron/cronJobs");


if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "dev-persistent") {
  cron.schedule('*/5 * * * * *', () => {
  // campaigns = cronJobs.checkCampaignGoal(); 
  cronJobs.checkCampaignGoalV2();
  // cronJobs.testFunction();
  })
} else if (process.env.NODE_ENV === "prod-VPC") {
  // disable blockchain on cloud because we are mainly testing locally. 
  // cron.schedule('*/5 * * * * *', () => {
  //   cronJobs.checkCampaignGoalV2();
  //   })
}

// for public routes
// TODO: implement view engine for admin dashboard if there is time
app.use('/', require('./routes/index.route'));

const db = require("./db/models");
const createHttpError = require("http-errors");
if (process.env.NODE_ENV === 'prod-VPC'|| process.env.NODE_ENV === 'dev-persistent') {
  db.sequelize.sync({ alter: true, logging:false }).then((res) => {
    console.log("Checked current db state and made necessary changes to match defined models.");
  }).catch( function (error) {
    throw(error)
  });
} else {
  db.sequelize.sync({ force: true, logging:false }).then((res) => {
    console.log("Drop and re-sync db.");
  }).catch( function (error) {
    throw(error)
  });
}

app.use('/admin', require('./db/routes/admin.routes'));
app.use('/api/db/startup', require('./db/routes/startup.routes'));
app.use('/api/db/retailInvestors', logger.retailInvLogger, require('./db/routes/retailInvestors.routes'));
app.use('/api/db/general', require('./db/routes/general.routes'));

// app.use('/api/sc2/', require('./V2SmartContracts/routes/sc.routes'));
if (process.env.NODE_ENV !== 'prod-VPC') app.use('/api/db/misc/', require('./db/routes/misc.routes')); // use for jest test setup teardown 
if (process.env.NODE_ENV !== 'test'){
  if (process.env.NODE_ENV !== 'prod-VPC') app.use('/test/api/sc2/', require('./V2SmartContracts/routes/sc.routes'));
  if (process.env.NODE_ENV !== 'prod-VPC') app.use('/api/sc/', require('./smartContracts/routes/sc.routes'));  
}


/** Error Handlers */
// 404
app.use((err, req, res, next) => {
  console.log(err)
  if (err.name === "UnauthorizedError") {
    next(createHttpError(401, "Invalid Token"))
  }
  else if (err.statusCode === 403) {
    next(err)
  }
  else if (err.statusCode === 404) {
    next(err)
  }
  else {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  }
}); 
// other errors
app.use((error, req, res, next) => {
  // console.log(error)
  res.status(error.status || error.statusCode || 500).send({
    error: {
      status: error.status || error.statusCode || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});


// set port, listen for requests
const DEV_PORT = process.env.DEV_PORT || 8080;

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
}
else if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'prod-VPC') {
  app.listen(process.env.PORT, "0.0.0.0" , () => {
    console.log(`Server is running on port. ${process.env.PORT}`);
  });
}
else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'dev-persistent') {
  app.listen(DEV_PORT, () => {
    console.log(`Server is running on port ${DEV_PORT}.`);
  });
}
