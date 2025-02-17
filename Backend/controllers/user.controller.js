const userModel = require("../models/user.model");
const rideModel = require("../models/ride.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator"); //the validation in route,if it lead to to wrong value and need to perform action on it
const blackListTokenModel = require("../models/blackListToken.model");
const uploadOnCloudinary = require("../utils/Cloudinary");
const asyncHandler = require("../utils/AsyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

module.exports.registerUser = asyncHandler(async (req, res) => {
	try {
		const errors = validationResult(req);

		//if something if wrong the give error in routes comes in errors.array
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in register controller", errors.array());
		}

		const { firstname, lastname, email, password, mobileNumber } = req.body;

		const isUserAlreadyExists = await userModel.findOne({ email });
		if (isUserAlreadyExists) {
			throw new ApiError(400, "User email already exists");
		}

		const hashedPassword = await userModel.hashPassword(password);

		// Correct ProfileImage path (use req.file)
		const ProfilePictureLocalPath = req.file?.path;
		let profileImageUrl = process.env.DEFAULT_PROFILE_IMAGE_URL;
		if (ProfilePictureLocalPath) {
			// Upload to Cloudinary
			const profileImage = await uploadOnCloudinary(ProfilePictureLocalPath);
			if (!profileImage) {
				throw new ApiError(400, "Error uploading profile picture");
			}
			profileImageUrl = profileImage.url;
		}

		const user = await userService.createUser({
			firstname: firstname,
			lastname: lastname,
			email,
			password: hashedPassword,
			profileImage: profileImageUrl,
			mobileNumber,
		});

		const token = user.generateAuthToken(); //give id of user

		user.password = undefined;

		return res.status(201).json(new ApiResponse(201, "User created successfully", { token, user }));
	} catch (error) {
		throw new ApiError(400, "error in register controller", error.message);
	}
});

module.exports.loginUser = asyncHandler(async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in login controller", errors.array());
		}

		const { email, password } = req.body;

		const user = await userModel.findOne({ email }).select("+password");
		if (!user) {
			// return res.status(401).json({ message: "Invalid email or password" });
			throw new ApiError(401, "Invalid email or password");
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			throw new ApiError(401, "Invalid email or password");
		}

		const token = user.generateAuthToken();

		res.cookie("token", token, {
			httpOnly: true,
			secure: false, // Set to true if using HTTPS
			sameSite: "Lax", // Adjust as needed: 'Strict', 'Lax', or 'None'
		});

		user.password = undefined;

		return res.status(200).json(new ApiResponse(200, "User logged in successfully", { token, user }));
	} catch (error) {
		throw new ApiError(400, "error in login controller", error.message);
	}
});

module.exports.getUserProfile = asyncHandler(async (req, res, next) => {
	try {
		return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", req.user));
	} catch (error) {
		throw new ApiError(400, "error in getuserprofile controller", error.message);
	}
});

//logout user
module.exports.logoutUser = asyncHandler(async (req, res, next) => {
	try {
		res.clearCookie("token");
		const token = req.cookies.token || req.headers.authorization.split(" ")[1];

		await blackListTokenModel.create({ token }); //dont need to send createdat

		return res.status(200).json(new ApiResponse(200, "User logged out successfully"));
	} catch (error) {
		throw new ApiError(400, "error in logoutuser controller", error.message);
	}
});

module.exports.rideHistory = asyncHandler(async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ApiError(400, "error in login controller", errors.array());
		}

		const user = req.user;
		const rides = await rideModel.find({ user: user._id, status: "completed" }).populate("user").populate("captain").populate("feedback").lean();

        console.log('rideHistory',rides);


		return res.status(200).json(new ApiResponse(200, "Ride history fetched successfully", rides));
	} catch (error) {
		throw new ApiError(400, "error in ridehistory controller", error.message);
	}
});
