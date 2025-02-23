const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const uploadOnCloudinary = require("../utils/Cloudinary");
const rideModel = require("../models/ride.model");

module.exports.registerCaptain = asyncHandler(async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in register controller captain", errors.array());
		}

		const { firstname, lastname, email, password, color, plate, capacity, vehicleType, model, mobileNumber } =
			req.body;

		const isCaptainAlreadyExist = await captainModel.findOne({ email });

		if (isCaptainAlreadyExist) {
			throw new ApiError(400, "Captain already exist with given email");
		}

		const hashedPassword = await captainModel.hashPassword(password);

		// Correct ProfileImage path (use req.file)
		const ProfilePictureLocalPath = req.file?.path;
		let profileImageUrl = process.env.DEFAULT_PROFILE_IMAGE_CAPTAIN_URL;
		if (ProfilePictureLocalPath) {
			// Upload to Cloudinary
			const profileImage = await uploadOnCloudinary(ProfilePictureLocalPath);
			if (!profileImage) {
				throw new ApiError(400, "Error uploading profile picture");
			}
			profileImageUrl = profileImage.url;
		}

		const captain = await captainService.createCaptain({
			firstname,
			lastname,
			email,
			password: hashedPassword,
			color,
			plate,
			capacity,
			vehicleType,
			model,
			mobileNumber,
			profileImage: profileImageUrl,
		});

		const token = captain.generateAuthToken();
		captain.password = undefined;


		return res.status(201).json(new ApiResponse(201, "Captain registered successfully", { token, captain }));
	} catch (error) {
		throw new ApiError(500, "Server error,Error registering captain", error.message);
	}
});

module.exports.loginCaptain = asyncHandler(async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in login controller", errors.array());
		}

		const { email, password } = req.body;

		const captain = await captainModel.findOne({ email }).select("+password");

		if (!captain) {
			throw new ApiError(401, "Invalid email or password");
		}

		const isMatch = await captain.comparePassword(password);

		if (!isMatch) {
			throw new ApiError(401, "Invalid email or password");
		}

		// Update the captain's status to active on login.
		captain.status = "active";
		await captain.save();

		const token = captain.generateAuthToken();

		res.cookie("token", token, {
			httpOnly: true,
			secure: false, // Set to true if using HTTPS
			sameSite: "Lax", // Adjust as needed: 'Strict', 'Lax', or 'None'
		});
		captain.password = undefined;

		return res.status(200).json(new ApiResponse(200, "Captain logged in successfully", { token, captain }));
	} catch (error) {
		throw new ApiError(500, "Server error,Error logging in captain", error.message);
	}
});

module.exports.getCaptainProfile = asyncHandler(async (req, res, next) => {
	try {
		return res.status(200).json(new ApiResponse(200, "Captain profile fetched successfully", req.captain));
	} catch (error) {
		throw new ApiError(500, "Server error,Error getting captain profile", error.message);
	}
});

module.exports.logoutCaptain = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

		const blacklisted = await blackListTokenModel.create({ token });

		res.clearCookie("token");

		return res.status(200).json(new ApiResponse(200, "Captain logged out successfully"));
	} catch (error) {
		throw new ApiError(500, "Server error,Error logging out captain", error.message);
	}
});

module.exports.getTodaysDetails = asyncHandler(async (req, res, next) => {
	try {
		const captainDetails = await captainService.getTodaysDetails(req.captain._id);
		return res.status(200).json(new ApiResponse(200, "Todays details fetched successfully", captainDetails));
	} catch (error) {
		throw new ApiError(500, "Server error,Error getting todays details", error.message);
	}
});

module.exports.captainRideHistory = asyncHandler(async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in login controller", errors.array());
		}

		const rides = await rideModel.find({ captain: req.captain._id, status: "completed" }).populate("user").populate("captain").populate("feedback").lean();
		

		return res.status(200).json(new ApiResponse(200, "Captain ride history fetched successfully", rides));
	} catch (error) {
		throw new ApiError(500, "Server error,Error getting captain ride history", error.message);
	}
});