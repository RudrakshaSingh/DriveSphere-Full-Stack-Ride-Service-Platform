const mongoose = require("mongoose");
const rideSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		captain: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "captain",
		},
		origin: {
			type: [Number], // [longitude, latitude]
			required: true,
			validate: {
				validator: function (v) {
					return Array.isArray(v) && v.length === 2 && v.every((coord) => typeof coord === "number");
				},
				message: (props) => `${props.value} is not a valid coordinate pair!`,
			},
		},
		destination: {
			type: [Number], // [longitude, latitude]
			required: true,
			validate: {
				validator: function (v) {
					return Array.isArray(v) && v.length === 2 && v.every((coord) => typeof coord === "number");
				},
				message: (props) => `${props.value} is not a valid coordinate pair!`,
			},
		},
		originText: {
			type: String,
			required: true,
		},

		destinationText: {
			type: String,
			required: true,
		},
		fare: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
			default: "pending",
		},
		duration: {
			type: Number,
		}, // in seconds
		distance: {
			type: Number,
		}, // in meters
		paymentID: {
			type: String,
		},
		orderId: {
			type: String,
		},
		signature: {
			type: String,
		},
		otp: {
			type: String,
			select: false,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model("ride", rideSchema);
