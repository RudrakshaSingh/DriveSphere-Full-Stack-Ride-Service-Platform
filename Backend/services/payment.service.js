const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");
const rideModel = require("../models/ride.model");
const ApiError = require("../utils/ApiError");
const couponModel = require("../models/coupon.model");

require("dotenv").config();

// Configure Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

module.exports.initiatePayment = async (order_amount, customer_name, customer_phone, customer_email, customer_id) => {
	try {
		const orderId = crypto.randomBytes(16).toString("hex");
		const orderCurrency = "INR";

		const request = {
			order_amount,
			order_currency: orderCurrency,
			order_id: orderId,
			customer_details: {
				customer_id,
				customer_phone,
				customer_name,
				customer_email,
			},
		};

		const response = await Cashfree.PGCreateOrder("2023-08-01", request);
		return response.data;
	} catch (error) {
		throw new ApiError(500, "Error in initiating payment", error.message);
	}
};

module.exports.verifyPayment = async (orderId, rideId, couponResponse) => {
	try {
		console.log("orderId", orderId, "rideId", rideId);

		const ride = await rideModel.findById(rideId);
		if (!ride) {
			throw new ApiError(404, "Ride not found");
		}
		console.log("hi failed");

		const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
		console.log("response");
		if (response?.data[0]?.payment_status !== "SUCCESS") {
			throw new ApiError(400, "Payment failed");
		}
		ride.payment.orderId = response?.data[0]?.order_id;
		ride.payment.transactionId = response?.data[0]?.cf_payment_id;
		ride.payment.date = response?.data[0]?.payment_time
		ride.payment.amount = response?.data[0]?.payment_amount;
		ride.payment.paymentMethod = response?.data[0]?.payment_group;
		await ride.save();

		if(ride.fare!=response?.data[0]?.payment_amount){
			console.log("copon used",couponResponse);
			
			const coupon=await couponModel.findById(couponResponse._id);
			coupon.isActive=false;
			await coupon.save();
		}

		return response.data;
	} catch (error) {
		throw new ApiError(500, "Error in verifying payment", error.message);
	}
};
