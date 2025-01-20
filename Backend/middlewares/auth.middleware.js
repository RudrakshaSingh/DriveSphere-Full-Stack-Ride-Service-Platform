const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const backlisted=await userModel.findOne({token:token});
    if(backlisted){
      return res.status(401).json({ message: "Unauthorized.token is blacklisted" });
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);//as id is given in user model while generating token we get id by decoding
    const user = await userModel.findById(decodedToken._id);

    req.user = user;// taking it in response in controller
    if (!user) {
        return res.status(401).json({ error: "Unauthorized.no user found by email" });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Server error middleware" });
  }
};
