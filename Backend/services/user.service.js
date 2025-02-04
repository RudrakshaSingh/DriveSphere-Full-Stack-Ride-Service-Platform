const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.createUser  = async ({ firstname, lastname, email, password,profileImage,mobileNumber }) => {
  
  if (!firstname || !email || !password ||!mobileNumber||!profileImage) {
    throw new ApiError(400, "All fields are required");
  }

   

  const user = userModel.create({ fullname: { firstname, lastname }, email, password,profileImage,mobileNumber, });

  return user;
};
