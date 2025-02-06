const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");

module.exports.createRide = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ApiError(400, "error in register controller", errors.array());
	}

	const { origin, destination, vehicleType, originText, destinationText } = req.body;
	try {
		const ride = await rideService.createRide({
			user: req.user._id,
			origin,
			destination,
			vehicleType,
			originText,
			destinationText,
		});

		res.status(201).json(new ApiResponse(201, "Ride created successfully", ride));

		const captainsInRadius = await mapsService.getCaptainsInRadius(origin[0], origin[1], 2);
		ride.otp = "";

		captainsInRadius.map((captain) => {
			
			sendMessageToSocketId(captain.socketId, {
				event: "new-ride",
				data: ride,
			});
		});
	} catch (err) {
		throw new ApiError(500, "error in createride controller", err.message);
	}
});

module.exports.getFareController = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: "error",
			errors: errors.array(),
		});
	}

	try {
		const { originLatitute, originLongitude, destinationLatitude, destinationLongitude } = req.query;

		// Create coordinate arrays
		const origin = [parseFloat(originLongitude), parseFloat(originLatitute)];
		const destination = [parseFloat(destinationLongitude), parseFloat(destinationLatitude)];

		const fareResponse = await rideService.getFare(origin, destination);

		return res.status(200).json(new ApiResponse(200, "Fare fetched successfully", fareResponse));
	} catch (error) {
		throw new ApiError(500, "error in getFare controller", error.message);
	}
});
