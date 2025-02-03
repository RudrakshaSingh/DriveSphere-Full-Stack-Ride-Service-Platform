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
	const { userId, origin, destination, vehicleType } = req.body;
	try {
		const ride = await rideService.createRide({ user: req.user._id, origin, destination, vehicleType });

        return res.status(201).json(new ApiResponse(201, "Ride created successfully", ride));
	} catch (err) {
        throw new ApiError(500,"error in createride controller", err.message);
	}
});
