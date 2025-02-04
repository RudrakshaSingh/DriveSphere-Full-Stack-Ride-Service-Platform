const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		fullname: {
			firstname: {
				type: String,
				required: true,
				minlength: [3, "First name must be at least 3 characters long"],
			},
			lastname: {
				type: String,
				minlength: [3, "Last name must be at least 3 characters long"],
			},
		},
		email: {
			type: String,
			required: true,
			unique: true,
			minlength: [5, "Email must be at least 5 characters long"],
		},
		password: {
			type: String,
			required: true,
			select: false, //so that it does not go when we find user by default does not go
		},
		profileImage: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
			required: true,
			unique: true,
		},
		socketId: {
			//for live tracking to share location of uber to user live
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" }); //expire time for blacklisting schema
	return token;
};

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

//static method are used to create a method that can be called directly on the model
userSchema.statics.hashPassword = async function (password) {
	return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
