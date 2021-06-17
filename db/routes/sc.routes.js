const FungibleTokenController = require("../../smartContracts/controllers/fungibleToken.controller.js");
const MilestoneController = require("../../smartContracts/controllers/milestone.controller.js");
const router = require("express").Router();

router.get("/FTtransfer", FungibleTokenController.transfer);
router.get("/FTdeploy", FungibleTokenController.deploy);
router.get("/milestoneDeploy", MilestoneController.deploy);
router.get("/milestoneCallM1", MilestoneController.callFinishMilestoneOne);
router.get("/milestoneCallM2", MilestoneController.callFinishMilestoneTwo);
router.get("/milestoneCallM3", MilestoneController.callFinishMilestoneThree);
router.get("/milestoneCallSetDeadline", MilestoneController.callSetDeadlineTrue);
router.get("/milestoneCallClaimback", MilestoneController.callClaimback);



module.exports = router;

