const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const ApiError = require("../utils/ApiError");

module.exports.createCaptain = async ({
	firstname,
	lastname,
	email,
	password,
	color,
	plate,
	capacity,
	vehicleType,
	model,
	mobileNumber,
	profileImage,
}) => {
	if (
		!firstname ||
		!email ||
		!password ||
		!color ||
		!plate ||
		!capacity ||
		!vehicleType ||
		!model ||
		!mobileNumber ||
		!profileImage
	) {
		throw new ApiError(400, "All fields are required");
	}

	const captain = await captainModel.create({
		fullname: { firstname, lastname },
		email,
		password,
		vehicle: { color, plate, capacity, vehicleType, model },
		mobileNumber,
		profileImage,
	});

	return captain;
};

module.exports.getTodaysDetails = async (captain) => {
	// Define the start and end of the current day
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date();
	endOfDay.setHours(23, 59, 59, 999);

	const rides = await rideModel
		.find({
			captain: captain,
			status: "completed",
			createdAt: { $gte: startOfDay, $lte: endOfDay },
		})
		.lean();
	console.log("captoday", rides);

	// Initialize a summary object and iterate over rides to accumulate totals.
	const summary = rides.reduce(
		(acc, ride) => {
			acc.fare += Number(ride.fare); // Convert fare to a number and add to total
			acc.duration += Number(ride.duration); // Convert duration to a number and add to total
			acc.distance += Number(ride.distance); // Convert distance to a number and add to total
			acc.ridesDone += 1; // Increment rides count
			return acc;
		},
		{ fare: 0, duration: 0, distance: 0, ridesDone: 0 }
	);

	return summary;
};
