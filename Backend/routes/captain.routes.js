const captainController = require("../controllers/captain.controller");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post(
  "/register",upload.single("profileImage"),
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
		body("lastname").isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("color").isLength({ min: 3 }).withMessage("Color must be at least 3 characters long"),
    body("plate").isLength({ min: 3 }).withMessage("Plate must be at least 3 characters long"),
    body("capacity").isLength({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("vehicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Invalid vehicle type"),
    body("model").isLength({ min: 2 }).withMessage("Model must be at least 2 characters long"),
    body('mobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile number must be a numeric value'),
  ],
  captainController.registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain
);

router.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile);

router.get("/logout", authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;
