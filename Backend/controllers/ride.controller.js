const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

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
		

		return res.status(201).json(new ApiResponse(201, "Ride created successfully", ride));
	} catch (err) {
		throw new ApiError(500, "error in createride controller", err.message);
	}
});

module.exports.getFareController = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    }

    try {
        const { originLatitute, originLongitude, destinationLatitude, destinationLongitude } = req.query;

        // Create coordinate arrays
        const origin = [parseFloat(originLatitute ), parseFloat(originLongitude)];
        const destination = [parseFloat( destinationLatitude), parseFloat(destinationLongitude)];
		console.log("origin",origin);
		console.log("destination",destination);
		
        const fareResponse = await rideService.getFare(origin, destination);
		console.log("fare",fareResponse);
		

		return res.status(200).json(new ApiResponse(200, "Fare fetched successfully", fareResponse));
    } catch (error) {
		throw new ApiError(500, "error in getFare controller", error.message);
    }
});
