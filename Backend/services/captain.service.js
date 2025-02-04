const captainModel = require("../models/captain.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.createCaptain = 
	async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType, model, mobileNumber, profileImage }) => {
		if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType || !model || !mobileNumber || !profileImage) {
			throw new ApiError(400, "All fields are required");
		}
		const captain = captainModel.create({
			fullname: { firstname, lastname },
			email,
			password,
			vehicle: { color, plate, capacity, vehicleType,model },
			mobileNumber,
			profileImage
		});

		return captain;
	}
;
