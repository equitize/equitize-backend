const router = require("express").Router();
const miscController = require("../controllers/misc.controller");

// load a set of startups into db with assigned industries
router.post('/loadStartups', miscController.loadStartups)

module.exports = router;