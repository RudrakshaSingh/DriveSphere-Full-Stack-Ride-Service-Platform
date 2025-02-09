const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
	"/create",
	authMiddleware.authUser,
	body("origin")
		.isArray({ min: 2, max: 2 })
		.withMessage("Origin must be an array with exactly two coordinates [longitude, latitude]")
		.custom((value) => value.every((coord) => typeof coord === "number"))
		.withMessage("Each coordinate in the origin must be a number"),

	body("destination")
		.isArray({ min: 2, max: 2 })
		.withMessage("Destination must be an array with exactly two coordinates [longitude, latitude]")
		.custom((value) => value.every((coord) => typeof coord === "number"))
		.withMessage("Each coordinate in the destination must be a number"),

	body("vehicleType")
		.isString()
		.isIn(["auto", "car", "moto"])
		.withMessage("Invalid vehicle type. Allowed types: auto, car, moto"),
	body("originText")
		.isString()
		.withMessage("Origin text must be a valid string")
		.notEmpty()
		.withMessage("Origin text is required"),

	// Destination Text Validation
	body("destinationText")
		.isString()
		.withMessage("Destination text must be a valid string")
		.notEmpty()
		.withMessage("Destination text is required"),

	rideController.createRide
);

router.get(
	"/get-fare",
	authMiddleware.authUser,
	[
		query("originLatitute").isFloat().withMessage("Origin latitude must be a valid number"),
		query("originLongitude").isFloat().withMessage("Origin longitude must be a valid number"),
		query("destinationLatitude").isFloat().withMessage("Destination latitude must be a valid number"),
		query("destinationLongitude").isFloat().withMessage("Destination longitude must be a valid number"),
	],
	rideController.getFareController
);

router.post(
	"/confirm",
	authMiddleware.authCaptain,
	body("rideId").isMongoId().withMessage("Invalid ride id"),
	rideController.confirmRide
);

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

module.exports = router;
