const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/AsyncHandler");

module.exports.initiatePayment = asyncHandler(async (req, res) => {
	try {
		const {order_amount, customer_name, customer_phone, customer_email, customer_id} = req.body;
		if (!order_amount || !customer_name || !customer_phone || !customer_email || !customer_id) {
			throw new ApiError(400, "All fields are required");
		}
		
		const paymentSessionId = await paymentService.initiatePayment( order_amount, customer_name, customer_phone, customer_email, customer_id);

		res.status(200).json(new ApiResponse(200, "Payment initiated successfully", paymentSessionId));
	} catch (error) {
		throw new ApiError(500, "error in initiatePayment controller", error.message);
	}
});

module.exports.verifyPayment = asyncHandler(async (req, res) => {
	try {
		const { orderId,rideId, couponResponse } = req.body;
		console.log("orderId", orderId, "rideId", rideId);
		
		
		if (!orderId || !rideId) {
			throw new ApiError(400, "Order ID and Ride ID is required");
		}
        
		const paymentResponse = await paymentService.verifyPayment(orderId,rideId, couponResponse);
        // console.log("payment",paymentResponse);
        

		res.status(200).json(new ApiResponse(200, "Payment verified successfully", paymentResponse));
	} catch (error) {
		throw new ApiError(500, "error in verifyPayment controller", error.message);
	}
});
