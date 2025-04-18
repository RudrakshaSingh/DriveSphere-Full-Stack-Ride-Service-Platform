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
			default: null,
		},
		feedback: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Feedback",
			default: null,
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
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
			default: "pending",
		},
		duration: {
			type: String,
			required: true,
		}, // in min
		distance: {
			type: String,
			required: true,
		}, // in km
		payment: {
			orderId: {
				default: null,
				type: String,
			},
			transactionId: {
				default: null,
				type: String,
			},
			date: {
				default: null,
				type: Date,
			},
			amount: {
				type: Number,
				default: 0,
			},
			paymentMethod: {
				type: String,
				default: "cash",
			},
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
