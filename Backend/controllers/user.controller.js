const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator"); //the validation in route,if it lead to to wrong value and need to perform action on it

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  //if something if wrong the give error in routes comes in errors.array
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {  fullname, email, password } = req.body;

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();//give id of user

  res.status(201).json({ token, user });
};
