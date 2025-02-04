const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainSchema = new mongoose.Schema({
	fullname: {
		firstname: {
			type: String,
			required: true,
			minlength: [3, "First name must be at least 3 characters long"],
			maxlength: 50,
		},
		lastname: {
			type: String,
			minlength: [3, "Last name must be at least 3 characters long"],
			maxlength: 50,
		},
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: [3, "Email must be at least 5 characters long"],
		match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	socketId: {
		type: String,
	},
	status: {
		type: String,
		enum: ["online", "offline"],
		default: "online",
	},
	vehicle: {
		color: {
			type: String,
			required: true,
			minlength: [3, "Color must be at least 3 characters long"],
		},
		plate: {
			type: String,
			required: true,
			minlength: [3, "Plate must be at least 3 characters long"],
		},
		capacity: {
			type: Number,
			required: true,
			min: 1,
			max: 4,
		},
		model: {
			type: String,
			required: true,
		},
		vehicleType: {
			type: String,
			required: true,
			enum: ["motorcycle", "car", "van", "auto"],
		},
	},
	location: {
		latitude: {
			type: Number,
			default: undefined,
		},
		longitude: {
			type: Number,
			default: undefined,
		},
	},
	ProfilePicture: {
		type: String,
		required: true,
	},
	mobileNumber: {
		type: Number,
		required: true,
		unique: true,
	},
	otp: {
		type: Number,
	},
	otpExpires: {
		type: Number,
	},
	hoursWorked: {
		type: Number,
		default: 0,
		set: (value) => {
			// Round to two decimal places
			return Math.round(value * 100) / 100;
		},
	},
	distanceTravelled: {
		type: Number,
		default: 0,
	},
	RideDone: {
		type: Number,
		default: 0,
	},
	TotalEarnings: {
		type: Number,
		default: 0,
	},
});
captainSchema.pre("save", function (next) {
	if (this.hoursWorked) {
		this.hoursWorked = Math.round(this.hoursWorked * 100) / 100;
	}
	next();
});
captainSchema.methods.generateAuthToken = async function () {
	const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
	return token;
};
captainSchema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password);
	return isMatch;
};
captainSchema.statics.hashPassword = async function (password) {
	return await bcrypt.hash(password, 10);
};
const capatainModel = mongoose.model("captain", captainSchema);
module.exports = capatainModel;
