const express = require("express");
const multer = require("multer");
const cors = require("cors");
const logger = require("./utils/log/logger");
const app = express();
require('dotenv').config({
  path: `${__dirname}/.env`
});

var corsOptions = {
  origin: "*"
};

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // limt : 3mb
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
let campaigns;

if (process.env.NODE_ENV!=="test") {
cron.schedule('*/5 * * * * *', ()=>{
  campaigns = cronJobs.checkCampaignGoal(); 
})
}



// // for public routes
// // TODO: implement view engine for admin dashboard if there is time
app.use('/', require('./routes/index.route'));

// db
const db = require("./db/models");
db.sequelize.sync({ force: true, logging:false }).then((res) => {
  console.log("Drop and re-sync db.");
}).catch( function (error) {
  console.log(error)
  throw(error)
});


app.use('/admin', require('./db/routes/admin.routes'));
app.use('/api/db/startup', require('./db/routes/startup.routes'));
app.use('/api/db/retailInvestors', logger.retailInvLogger, require('./db/routes/retailInvestors.routes'));
app.use('/api/db/campaign', require('./db/routes/campaign.routes'));
app.use('/api/db/junctionTable', require('./db/routes/junctionTable.routes'));
app.use('/api/db/general', require('./db/routes/general.routes'));
app.use('/api/sc', require('./smartContracts/routes/sc.routes'));
app.use('/api/db/misc', require('./db/routes/misc.routes')); // use for jest test setup teardown 


/** Error Handlers */
// 404
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
}); 
// other errors
app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});




// set port, listen for requests
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
