const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post(
	"/register",upload.single("profileImage"),
	[
		body("email").isEmail().withMessage("Invalid Email"),
		body("firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
		body("lastname").isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
		body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
		body('mobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile number must be a numeric value'),
	],
	userController.registerUser
);

router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Invalid Email"),
		body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
	],
	userController.loginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);
router.get("/ridehistory", authMiddleware.authUser, userController.rideHistory);
router.delete("/delete",authMiddleware.authUser,userController.deleteUserAccount)
router.get("/logout", authMiddleware.authUser, userController.logoutUser);
router.put(
    "/update-profile",
    authMiddleware.authUser,
    upload.single("profileImage"),
    [
        body("firstname").optional().isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
        body("lastname").optional().isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
        body("email").optional().isEmail().withMessage("Invalid Email"),
        body("mobileNumber").optional().isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digits"),
    ],
    userController.updateUserProfile
);

router.post(
    "/change-password",
    authMiddleware.authUser,
    [
        body("currentPassword").isLength({ min: 6 }).withMessage("Current password must be at least 6 characters long"),
        body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long")
            .custom((value, { req }) => {
                if (value === req.body.currentPassword) {
                    throw new Error("New password must be different from current password");
                }
                return true;
            }),
    ],
    userController.changePassword
);

module.exports = router;
