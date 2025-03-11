import { useState } from "react";
/* eslint-disable react/prop-types */
import { ChevronDown, MapPin, IndianRupee } from "lucide-react";
import car from "../assets/car.png";
import moto from "../assets/moto.png";
import auto from "../assets/auto.png";
import toast from "react-hot-toast";
import axios from "axios";

const ConfirmRide = (props) => {
	// Determine the image based on vehicleType
	let vehicleImg = "";
	if (props.vehicleType === "car") {
		vehicleImg = car;
	} else if (props.vehicleType === "moto") {
		vehicleImg = moto;
	} else if (props.vehicleType === "auto") {
		vehicleImg = auto;
	}

	const [showCouponPopup, setShowCouponPopup] = useState(false);
	const [couponCode, setCouponCode] = useState("");
	//   const [couponResponse, setCouponResponse] = useState("");

	const handleCouponSubmit = async () => {
		// Show loading toast
		const loadingToastId = toast.loading("Applying coupon...");

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/extra/useCoupon`,
				{
					couponCode,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.status === 200) {
				// Update loading toast to success
				toast.success("Coupon code applied successfully!", { id: loadingToastId });
				setShowCouponPopup(false);
				props.setCouponResponse(response.data.message);

				setCouponCode("");
			} else if (response.status === 201) {
				// Update loading toast to error with provided message
				console.log("hi", response.data.data);

				toast.error(response.data.data, { id: loadingToastId });
			}
		} catch (error) {
			// Update loading toast to error for exceptions
			toast.error("Coupon code not valid!", { id: loadingToastId });
			console.log(error);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="bg-white rounded-t-2xl shadow-md p-4 relative">
				<button
					className="absolute top-3 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md"
					onClick={() => {
						props.setConfirmRidePanel(false);
						props.setCouponResponse("");
					}}>
					<ChevronDown size={28} className="text-gray-600" />
				</button>
				<h3 className="text-xl font-semibold text-center py-2 mt-10">Confirm Your Ride</h3>
			</div>

			<div className="p-4 flex flex-col items-center flex-grow justify-between">
				<img className="h-24 w-24 object-contain" src={vehicleImg} alt={props.vehicleType} />

				<div className="w-full">
					<div className="flex items-center gap-3 py-3 border-b">
						<div className="w-8 h-8 rounded-full flex items-center justify-center">
							<MapPin size={20} className="text-blue-600" />
						</div>
						<div>
							<h4 className="text-md font-semibold text-gray-800">Pickup</h4>
							<p className="text-sm text-gray-600">{props.pickup}</p>
						</div>
					</div>

					<div className="flex items-center gap-3 py-3 border-b">
						<div className="w-8 h-8  flex items-center justify-center">
							<MapPin size={20} className="text-green-600" />
						</div>
						<div>
							<h4 className="text-md font-semibold text-gray-800">Destination</h4>
							<p className="text-sm text-gray-600">{props.destination}</p>
						</div>
					</div>

					<div className="flex items-center gap-3 py-3 border-b">
						<div className="w-8 h-8 flex items-center justify-center">
							<IndianRupee size={20} className="text-yellow-600" />
						</div>
						<div>
							<h4 className="text-md font-semibold text-gray-800">Payment</h4>
							{props.couponResponse !== "" ? (
								<div className="flex items-center gap-2">
									<p className="text-sm text-gray-600 line-through">
										₹{props.fare[props.vehicleType]}
									</p>
									<p className="text-sm font-bold text-green-600">
										₹
										{Math.max(
											parseFloat(
												(
													props.fare[props.vehicleType] -
													(props.couponResponse.type === "fixed"
														? props.couponResponse.discount
														: (props.fare[props.vehicleType] *
																props.couponResponse.discount) /
														  100)
												).toFixed(2)
											),
											0
										)}
									</p>
								</div>
							) : (
								<p className="text-sm text-gray-600">₹{props.fare[props.vehicleType]}</p>
							)}
						</div>
					</div>

					<button
						className="w-full text-blue-600 mt-2 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors border border-blue-600 "
						onClick={() => setShowCouponPopup(true)}>
						Use Coupon Code
					</button>
				</div>

				<button
					onClick={() => {
						props.createRide();
					}}
					className="w-full bg-green-600 mt-2 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors">
					Confirm Ride
				</button>

				{showCouponPopup && (
					<div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
						<div className="bg-white rounded-xl p-6 shadow-lg">
							<h3 className="text-lg font-semibold mb-4">Enter Coupon Code</h3>
							<input
								type="text"
								placeholder="Coupon Code"
								className="w-full border rounded-md py-2 px-3 mb-4"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
							/>
							<div className="flex justify-end gap-4">
								<button
									className="py-2 px-4 rounded-md text-gray-600 hover:text-gray-800"
									onClick={() => setShowCouponPopup(false)}>
									Cancel
								</button>
								<button
									className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
									onClick={handleCouponSubmit}>
									Apply
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ConfirmRide;
