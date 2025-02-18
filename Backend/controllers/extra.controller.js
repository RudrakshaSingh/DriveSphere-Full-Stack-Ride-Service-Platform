const feedbackModel = require("../models/feedback.model");
const rideModel = require("../models/ride.model");
const supportModel = require("../models/support.model");
const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.sendSupportMessage = asyncHandler(async (req, res) => {
    try {
        const { name, email, message, mobileNumber } = req.body;
        if (!name || !email || !message || !mobileNumber) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const emailIndb= await userModel.findOne({email});
        const support= await supportModel.create({
            name,
            email,
            message,
            mobileNumber
        })
        return res.status(200).json(new ApiResponse(200, "Message sent successfully", support));

    } catch (error) {
        throw new ApiError(500, "error in sendSupportMessage controller", error.message);
    }
})

module.exports.sendFeedback = asyncHandler(async (req, res) => {
    // Destructure values from the request body.
    const { captainId, overallExperience, ratings, message, email,rideId } = req.body;
    
    // Validate required fields.
    if ( !overallExperience || !ratings ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if(!rideId){
        return res.status(400).json({ error: "Ride id is required" });
    }
    if(!captainId){
        return res.status(400).json({ error: "Captain id is required" });
    }
    
    // Construct the feedback data object.
    // Optional fields 'message' and 'email' are added only if they have a non-empty value.
    const ride = await rideModel.findOne({ _id: rideId });

    if(!ride){
        return res.status(201).json({ error: "Ride not found" });
    }
    if(ride.feedback){
        return res.status(201).json({ error: "Feedback already given" });
    }
    const feedbackData = {
      captain:captainId,
      overallExperience,
      ratings,
      ...(message && message.trim() ? { message } : {}),
      ...(email && email.trim() ? { email } : {}),
    };
  
    try {
        console.log("hi");
        
      const feedback = await feedbackModel.create(feedbackData);
      console.log("hi2");

      ride.feedback=feedback._id;
      await ride.save();
      return res.status(200).json(new ApiResponse(200, "Feedback sent successfully", feedback));
    } catch (error) {
      throw new ApiError(500, "Error in sendFeedback controller", error.message);
    }
  });
  