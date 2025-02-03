const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
	"/create",authMiddleware.authUser,
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

	rideController.createRide
);

module.exports = router;
