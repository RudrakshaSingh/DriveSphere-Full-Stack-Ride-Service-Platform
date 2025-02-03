const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.controller");

const { query, body } = require("express-validator");

router.get(
	"/get-coordinates",
	query("address").isString().isLength({ min: 3 }),
	authMiddleware.authUser,
	mapController.getCoordinates
);

router.get(
	"/get-suggestions",
	query("address").isString().isLength({ min: 3 }),
	mapController.getAutoCompleteSuggestions
);

router.post(
	"/get-distance-time",
	// Validate 'origin' as an array with exactly two numeric values
	body("origin")
		.isArray({ min: 2, max: 2 })
		.withMessage("Origin must be an array with exactly two numeric values [longitude, latitude].")
		.custom((value) => value.every((coord) => typeof coord === "number"))
		.withMessage("Each coordinate in the origin array must be a number."),

	// Validate 'destination' as an array with exactly two numeric values
	body("destination")
		.isArray({ min: 2, max: 2 })
		.withMessage("Destination must be an array with exactly two numeric values [longitude, latitude].")
		.custom((value) => value.every((coord) => typeof coord === "number"))
		.withMessage("Each coordinate in the destination array must be a number."),

	mapController.getDistanceTime
);

module.exports = router;
