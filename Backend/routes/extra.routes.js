const express = require("express");
const router = express.Router();
const extraController = require("../controllers/extra.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/send-message", extraController.sendSupportMessage);
router.post("/feedback", extraController.sendFeedback);
router.get("/makeCoupon", authMiddleware.authUser, extraController.makeCoupon);
router.post("/useCoupon", authMiddleware.authUser, extraController.useCoupon);

module.exports = router;
