const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.createUser  = async ({ firstname, lastname, email, password,profileImage,mobileNumber }) => {
  
  if (!firstname || !email || !password ||!mobileNumber||!profileImage) {
    throw new ApiError(400, "All fields are required");
  }

   // Convert mobileNumber to a number, ensuring it's valid
   const mobileNumberParsed = Number(mobileNumber);

   // Check if conversion was successful
   if (isNaN(mobileNumberParsed)) {
     throw new ApiError(400, "Invalid mobile number");
   }

  const user = userModel.create({ fullname: { firstname, lastname }, email, password,profileImage,mobileNumber: mobileNumberParsed, });

  return user;
};
