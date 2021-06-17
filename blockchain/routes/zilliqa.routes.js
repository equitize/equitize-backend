const router = require("express").Router();
const zilliqaController = require("../controllers/zilliqa.controller");
const milestonePartController = require("../../db/controllers/milestonePart.controller");

router.get("/calculateZils/:startupId", 
    milestonePartController.getStartup, 
    zilliqaController.getMilestone,
    zilliqaController.getCampaigns,
    zilliqaController.getZilAmt
);

module.exports = router;