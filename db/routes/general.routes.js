const general = require("../controllers/general.controller.js");
const router = require("express").Router();

router.get('/getDocuments', general.getDocuments)

module.exports = router