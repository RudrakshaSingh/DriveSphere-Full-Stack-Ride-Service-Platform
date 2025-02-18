const couponModel = require("../models/coupon.model");
const feedbackModel = require("../models/feedback.model");
const rideModel = require("../models/ride.model");
const supportModel = require("../models/support.model");
const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");
const crypto = require("crypto");

module.exports.sendSupportMessage = asyncHandler(async (req, res) => {
	try {
		const { name, email, message, mobileNumber } = req.body;
		if (!name || !email || !message || !mobileNumber) {
			return res.status(400).json({ error: "Missing required fields" });
		}
		const emailIndb = await userModel.findOne({ email });
		const support = await supportModel.create({
			name,
			email,
			message,
			mobileNumber,
		});
		return res.status(200).json(new ApiResponse(200, "Message sent successfully", support));
	} catch (error) {
		throw new ApiError(500, "error in sendSupportMessage controller", error.message);
	}
});

module.exports.sendFeedback = asyncHandler(async (req, res) => {
	// Destructure values from the request body.
	const { captainId, overallExperience, ratings, message, email, rideId } = req.body;

	// Validate required fields.
	if (!overallExperience || !ratings) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	if (!rideId) {
		return res.status(400).json({ error: "Ride id is required" });
	}
	if (!captainId) {
		return res.status(400).json({ error: "Captain id is required" });
	}

	// Construct the feedback data object.
	// Optional fields 'message' and 'email' are added only if they have a non-empty value.
	const ride = await rideModel.findOne({ _id: rideId });

	if (!ride) {
		return res.status(201).json({ error: "Ride not found" });
	}
	if (ride.feedback) {
		return res.status(201).json({ error: "Feedback already given" });
	}
	const feedbackData = {
		captain: captainId,
		overallExperience,
		ratings,
		...(message && message.trim() ? { message } : {}),
		...(email && email.trim() ? { email } : {}),
	};

	try {
		console.log("hi");

		const feedback = await feedbackModel.create(feedbackData);
		console.log("hi2");

		ride.feedback = feedback._id;
		await ride.save();
		return res.status(200).json(new ApiResponse(200, "Feedback sent successfully", feedback));
	} catch (error) {
		throw new ApiError(500, "Error in sendFeedback controller", error.message);
	}
});
exports.makeCoupon = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        let couponCode;
        let isUnique = false;

        // Attempt to generate a unique coupon code
        while (!isUnique) {
            // Generate a 3-byte random buffer and convert it to a hexadecimal string
            couponCode = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Check if the generated coupon code already exists in the database
            const existingCoupon = await couponModel.findOne({ code: couponCode });

            if (!existingCoupon) {
                isUnique = true;
            }
        }
        
        
        const newCoupon = new couponModel({
            code: couponCode,
            discount: 100, // Example discount value
            type: 'fixed', // or 'percentage'
            // Add other fields as necessary
        });
        await newCoupon.save();
        

        // Add the coupon's ObjectId to the user's coupons array
        await userModel.findByIdAndUpdate(
            user._id,
            { $push: { coupons: newCoupon._id } },
            { new: true, useFindAndModify: false }
        );

        return res.status(200).json(new ApiResponse(200, "Coupon created successfully", { newCoupon }));
    } catch (error) {
        throw new ApiError(500, "Error in makeCoupon controller", error.message);
    }
});

exports.useCoupon = asyncHandler(async (req, res) => {
	try {
		const user = req.user;
		const { couponCode } = req.body;

		const isUser= await userModel.findById(user._id);
		if(!isUser){
			return res.status(201).json(new ApiResponse(201, "User not found"));
		}

		// Find the coupon with the provided code
		const coupon = await couponModel.findOne({ code: couponCode });

		// Check if the coupon exists in user model also
		const isCoupon = isUser.coupons.includes(coupon._id);
		if (!isCoupon) {
			return res.status(201).json(new ApiResponse(201, "This Coupon not available for you"));
		}


		return res.status(200).json(new ApiResponse(200, "Coupon used successfully",  coupon ));
	} catch (error) {
		throw new ApiError(500, "Error in useCoupon controller", error.message);
	}
});