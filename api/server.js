const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/** Error Handlers */
// 404
// app.use((req, res, next) => {
//   next(createHttpError.NotFound());
// });
// // other errors
app.use((error, req, res, next) => {     
  console.log(error)
  error.status = error.status || 500
  res.status(error.status); 
  res.send(error);
});


//db
const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// require("./app/routes/retailInvestors.routes")(app);
require("./app/routes/startup.routes")(app);
require("./app/routes/retailInvestors.routes")(app);
require("./app/routes/campaign.routes")(app);
require("./app/routes/junctionTable.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
