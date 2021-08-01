const EquityTokenController = require("../controllers/equityToken.controller.js");
const XsgdController = require("../controllers/xsgd.controller.js");
const CrowdfundingController = require("../controllers/crowdfunding.controller.js");
const router = require("express").Router();

router.post("/ETdeploy", EquityTokenController.deploy);
router.post("/ETtransfer", EquityTokenController.transfer);
router.post("/ETtransferCF", EquityTokenController.transferBalanceToCF);
router.post("/ETburnToken", EquityTokenController.burnToken);

router.post("/XSGDdeploy", XsgdController.deploy);
router.post("/XSGDtransfer", XsgdController.transfer);
router.post("/XSGDincreaseAllowance", XsgdController.increaseAllowance);
router.post("/XSGDtransferFrom", XsgdController.transferFrom);


router.post("/CFdeploy", CrowdfundingController.deploy);
router.post("/CFsetCF", CrowdfundingController.setCrowdfundingSCAddress);
router.post("/CFdonate", CrowdfundingController.donate);
router.post("/CFsetCFdeadlineTrue", CrowdfundingController.setCrowdfundingDeadlineTrue);
router.post("/CFcrowdfundingGetFunds", CrowdfundingController.crowdfundingGetFunds);
router.post("/CFfinishMilestoneOne", CrowdfundingController.finishMilestoneOne);
router.post("/CFsetMilestoneDeadlineTrue", CrowdfundingController.setMilestoneDeadlineTrue);



router.post("/CFfinishMilestoneTwo", CrowdfundingController.finishMilestoneTwo);
router.post("/CFfinishMilestoneThree", CrowdfundingController.finishMilestoneThree);
router.post("/CFcrowdfundingFailClaimback", CrowdfundingController.crowdfundingFailClaimback);



module.exports = router;

