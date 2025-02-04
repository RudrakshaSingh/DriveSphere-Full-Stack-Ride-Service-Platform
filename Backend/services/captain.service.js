const captainModel = require("../models/captain.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.createCaptain = asyncHandler(
	async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
		if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
			throw new ApiError(400, "All fields are required");
		}
		const captain = captainModel.create({
			fullname: { firstname, lastname },
			email,
			password,
			vehicle: { color, plate, capacity, vehicleType },
		});

		return captain;
	}
);
