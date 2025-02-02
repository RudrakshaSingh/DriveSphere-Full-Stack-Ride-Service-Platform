const userModel = require("../models/user.model");
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
			console.log("fff");

			return res.status(400).json({ errors: errors.array() });
			// throw new ApiError(400, "error in register controller", errors.array());
		}

		const { firstname, lastname, email, password } = req.body;

		const isUserAlreadyExists = await userModel.findOne({ email });
		if (isUserAlreadyExists) {
			console.log("hi");
			
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
				return res.status(400).json({ error: "Error uploading profile picture" });
			}
			profileImageUrl = profileImage.url;
		}

		const user = await userService.createUser({
			firstname: firstname,
			lastname: lastname,
			email,
			password: hashedPassword,
			profileImage: profileImageUrl,
		});

		const token = user.generateAuthToken(); //give id of user

		// res.status(201).json({ token, user });
		return res.status(201).json(new ApiResponse(201, "User created successfully", { token, user }));
	} catch (error) {
		throw new ApiError(400, "error in register controller", error.message);
	}
});

module.exports.loginUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	const user = await userModel.findOne({ email }).select("+password");
	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const token = user.generateAuthToken();

	res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'Lax' // Adjust as needed: 'Strict', 'Lax', or 'None'
  });

	res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
	res.status(200).json(req.user); //taken from token in middleware
};

//logout user
module.exports.logoutUser = async (req, res, next) => {
	res.clearCookie("token");
	const token = req.cookies.token || req.headers.authorization.split(" ")[1];

	await blackListTokenModel.create({ token }); //dont need to send createdat

	res.status(200).json({ message: "Logged out successfull" });
};
