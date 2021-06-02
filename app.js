const express = require("express");
const createHttpError = require("http-errors");

const cors = require("cors");
const app = express();
require('dotenv').config();


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for public routes
// TODO: implement view engine for admin dashboard if there is time
app.use('/', require('./routes/index.route'));



// db
const db = require("./db/models");
db.sequelize.sync({ force: true, logging:false }).then(() => {
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

// module.exports = app;
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
