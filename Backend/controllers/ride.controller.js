const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");

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

		const captainsInRadius = await mapsService.getCaptainsInRadius(origin[0], origin[1], 2000);
		if (captainsInRadiu=[]) {
			console.log("No captains in radius");
		}else{
			console.log("captains in radius", captainsInRadius.length);
		}
		ride.otp = "";
		
		const rideWithUser = await rideModel.findById(ride._id).populate("user");
		
		captainsInRadius.map((captain) => {
			console.log("fk",captain.socketId);
			
			sendMessageToSocketId(captain.socketId, {
				event: "new-ride",
				data: rideWithUser,
			});
		});
		console.log("hi");

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

module.exports.confirmRide = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ApiError(400, "error in confirmRide controller", errors.array());
	}
	const { rideId } = req.body;
	try {
		const ride = await rideService.confirmRide({ rideId, captain: req.captain });
		//to teel user
		sendMessageToSocketId(ride.user.socketId, {
			event: "ride-confirmed",
			data: ride,
		});
		return res.status(200).json(new ApiResponse(200, "Ride confirmed successfully", ride));
	} catch (err) {
		throw new ApiError(500, "error in confirmRide controller", err.message);
	}
});

module.exports.startRide = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
		throw new ApiError(400, "error in startRide controller", errors.array());
    }
    const { rideId, otp } = req.query;
    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
        console.log(ride);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json(ride);
    } catch (err) {
		throw new ApiError(500, "error in startRide controller", err.message);
    }
})

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })

		const updatedUser = await userModel.findByIdAndUpdate(
			ride.user._id,
			{
			  // Increment the fields by the appropriate amounts.
			  $inc: {
				ridesCompleted: 1,
				totalMoneySpend: ride.fare,    // ride.fare should contain the cost of the ride.
				totalDistance: ride.distance,   // ride.distance should contain the ride distance.
				totalTime: ride.duration            // ride.time should contain the ride duration.
			  }
			},
			{ new: true } // Return the updated user document.
		  );

		  const updatedCaptain = await captainModel.findByIdAndUpdate(
			ride.captain._id,
			{
			  // Increment the fields by the appropriate amounts.
			  $inc: {
				RideDone: 1,
				TotalEarnings: ride.fare,    // ride.fare should contain the cost of the ride.
				distanceTravelled: ride.distance,   // ride.distance should contain the ride distance.
				minutesWorked: ride.duration            // ride.time should contain the ride duration.
			  }
			},
			{ new: true } // Return the updated user document.
		  );
		
        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}