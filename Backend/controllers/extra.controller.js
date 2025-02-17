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
        if(!emailIndb){
            return res.status(201).json({ error: "Email not registered in drivo rides" });
        }
        const mobileNumberIndb= await userModel.findOne({mobileNumber});
        if(!mobileNumberIndb){
            return res.status(201).json({ error: "Mobile number not registered in drivo rides" });
        }
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