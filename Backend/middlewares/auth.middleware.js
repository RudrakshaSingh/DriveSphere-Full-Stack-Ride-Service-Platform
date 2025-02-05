const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");
const captainModel = require("../models/captain.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

module.exports.authUser = asyncHandler(async (req, res, next) => {
	try {
		
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
		
		if (!token) {
      throw new ApiError(401, "Unauthorized.token wrong");
		}

		const backlisted = await userModel.findOne({ token: token });
		if (backlisted) {
      throw new ApiError(401, "Unauthorized.token is blacklisted");
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //as id is given in user model while generating token we get id by decoding
		const user = await userModel.findById(decodedToken._id);

		req.user = user; // taking it in response in controller
		if (!user) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized.no user found by email"));
		}

		return next();
	} catch (err) {
    throw new ApiError(401, "Server error in auth middleware", err.message);
	}
});

module.exports.authCaptain = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

		if (!token) {
      throw new ApiError(401, "Unauthorized,token not found");
		}

		const isBlacklisted = await blackListTokenModel.findOne({ token: token });

		if (isBlacklisted) {
      throw new ApiError(401, "Unauthorized,token is blacklisted");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const captain = await captainModel.findById(decoded._id);
		if (!captain) {
      throw new ApiError(401, "Unauthorized,not able to find caption in authorization");
		}

		req.captain = captain;

		return next();
	} catch (err) {
    throw new ApiError(401, "Unauthorized,Error authenticating captain", err.message);
	}
});
