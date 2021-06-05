const express = require("express");
const createHttpError = require("http-errors");
const multer = require("multer");
const helpers = require("./cloudStorage/helpers/helpers");
// const getSignedURL = require("./cloudStorage/helpers/helpers");

const cors = require("cors");
const app = express();
require('dotenv').config({
  path: `${__dirname}/.env`
});


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


// for public routes
// TODO: implement view engine for admin dashboard if there is time
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

// Succesful API to upload file object with randon identifier
// TODO: integrate the storing of the link in mysql
app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    
    const imageUrl = await helpers.uploadImage(myFile)
    // helpers.uploadImage(myFile)
    // .then() {
    //   console.log('res1', res)
    // })
    // .then(function (res) {
    //   console.log('res2', res)
    // })
    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
});

// Test SignedURL API Cloud Storage
app.get('/abc', async (req, res, next) => {
  try {
    const myFile = req.body.file
    const request = await helpers.getSignedURL(myFile)
    res.send(request)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

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
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}