const general = require("../controllers/general.controller.js");
const router = require("express").Router();

router.get('/', general.documents)

module.exports = router