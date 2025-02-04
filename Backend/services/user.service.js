const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.createUser  = asyncHandler(async ({ firstname, lastname, email, password,profileImage }) => {
  if (!firstname || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = userModel.create({ fullname: { firstname, lastname }, email, password,profileImage });

  return user;
});
