const FungibleTokenController = require("../controllers/fungibleTokenSC.controller.js");
const MilestoneController = require("../controllers/milestoneSC.controller.js");
const zilliqaController = require("../controllers/zilliqa.controller");
const milestonePartController = require("../../db/controllers/milestonePart.controller");
const router = require("express").Router();

router.get("/FTtransfer", FungibleTokenController.transfer);
router.post("/FTdeploy", FungibleTokenController.deploy);

router.post("/milestoneDeploy/:startupId",
    milestonePartController.getStartup, 
    zilliqaController.getMilestone,
    zilliqaController.getCampaigns,
    zilliqaController.getZilAmt,
    MilestoneController.deploy,
    FungibleTokenController.deploy);

router.get("/milestoneCallM1", MilestoneController.callFinishMilestoneOne);
router.get("/milestoneCallM2", MilestoneController.callFinishMilestoneTwo);
router.get("/milestoneCallM3", MilestoneController.callFinishMilestoneThree);
router.get("/milestoneCallSetDeadline", MilestoneController.callSetDeadlineTrue);
router.get("/milestoneCallClaimback", MilestoneController.callClaimback);



module.exports = router;

