import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { MapPin, IndianRupee } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import UserHistoryMap from "../components/UserMenu/UserHistoryMap";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import toast from "react-hot-toast";

const Riding = () => {
	const location = useLocation();
	const { ride, couponResponse } = location.state || {}; // Retrieve ride data

	const [pickup, setPickup] = useState("");

	const [cashfree, setCashfree] = useState(null);

	// Initialize Cashfree SDK
	const initializeSDK = async () => {
		const cfInstance = await load({ mode: "sandbox" });
		setCashfree(cfInstance);
	};

	const calculateOrderAmount = () => {
		if (couponResponse === "") {
			return ride.fare;
		} else {
			// Calculate discount based on coupon type
			const discount =
				couponResponse.type === "fixed" ? couponResponse.discount : (ride.fare * couponResponse.discount) / 100;
			// Ensure the discounted amount isn’t negative
			return Math.max(ride.fare - discount, 0);
		}
	};

	useEffect(() => {
		initializeSDK();
	}, []);
	const getSessionId = async () => {
		try {
			const customer_name =
				ride?.user?.fullname.firstname +
				(ride?.user?.fullname.lastname ? " " + ride.user.fullname.lastname : "");
	
			const res = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/payment/initiate-payment`,
				{
					order_amount: calculateOrderAmount(),
					customer_name,
					customer_phone: ride?.user?.mobileNumber,
					customer_email: ride?.user?.email,
					customer_id: ride?.user._id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status === 200) {
				const order_id = res.data.message.order_id;
				return { paymentSessionId: res.data.message.payment_session_id, order_id };
			} else {
				toast.error("Failed to initiate payment. Please try again.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error initiating payment.");
		}
	};
	
	const handlePayment = async (e) => {
		e.preventDefault();
		try {
			const sessionData = await getSessionId();
			// If sessionData is not available, abort further processing
			if (!sessionData) return;
	
			const checkoutOptions = {
				paymentSessionId: sessionData.paymentSessionId,
				redirectTarget: "_modal",
			};
	
			await cashfree.checkout(checkoutOptions).then(() => {
				// Pass the order_id directly to verifyPayment
				verifyPayment(sessionData.order_id);
			});
		} catch (error) {
			console.error(error);
			toast.error("Payment initiation failed.");
		}
	};
	
	const verifyPayment = async (order_idParam) => {
		try {
			console.log("Order ID:", order_idParam);
			const res = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/payment/verify-payment`,
				{
					orderId: order_idParam,
					rideId: ride._id,
					couponResponse
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			if (res.status === 200) {
				console.log("Payment verified successfully!");
				toast.success("Payment successful!");
			} else {
				toast.error("Payment verification failed.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error verifying payment.");
		}
	};
	

	// socket.on("ride-ended", () => {
	// 	navigate("/home");
	// });

	// Update pickup with the browser's current location every 10 seconds
	useEffect(() => {
		const updatePickup = () => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					// Format the coordinates as desired.
					// Here we simply join them as a string.
					//   setPickup(`${latitude}, ${longitude}`);
					setPickup([longitude, latitude]);
				},
				(error) => {
					console.error("Error getting current location:", error);
				}
			);
		};

		// Get the location immediately on mount
		updatePickup();

		// Update location every 10 seconds
		const intervalId = setInterval(updatePickup, 10000);

		// Clear interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	const { socket } = useContext(SocketContext);
	const navigate = useNavigate();

	// Listen for the "ride-ended" event
	useEffect(() => {
		socket.on("ride-ended", () => {
			navigate("/user-feedback", { state: { rideId: ride._id, captainId: ride.captain._id, type: true } });
		});

		// Clean up the socket listener when the component unmounts or dependencies change
		return () => socket.off("ride-ended");
	}, [socket, navigate, ride]);

	return (
		<div className="h-full w-full relative">
			<Link
				to="/home"
				className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md">
				<i className="text-lg font-medium ri-home-5-line"></i>
			</Link>
			<div className="h-[40vh]">
				<UserHistoryMap pickup={pickup} drop={ride?.destination} />
			</div>
			<div className="h-[60vh] p-4 relative bg-white rounded-lg shadow-xl w-full mx-auto">
				<h3 className="text-xl font-semibold text-center mt-2 mb-4">Riding</h3>

				<div className="flex items-center gap-2 mb-4">
					<img
						className="h-16 w-16 rounded-full object-cover"
						src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
						alt="Driver"
					/>
					<div>
						<h2 className="text-lg font-semibold">
							{ride?.captain.fullname.firstname + " " + ride?.captain.fullname.lastname}
						</h2>
						<h4 className="text-md font-medium text-gray-600">{ride?.captain.vehicle.model}</h4>
						<p className="text-sm text-gray-500">{ride?.captain.vehicle.plate}</p>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
						<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
							<MapPin size={16} className="text-green-600" />
						</div>
						<div>
							<h3 className="text-md font-medium text-gray-900">Destination</h3>
							<p className="text-sm text-gray-600">{ride?.destinationText}</p>
						</div>
					</div>

					<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
						<div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
							<IndianRupee size={20} className="text-yellow-600" />
						</div>
						<div>
							<h3 className="text-lg font-medium text-gray-900">Payment</h3>
							{couponResponse !== "" ? (
								<div className="flex items-center gap-2">
									<p className="text-sm text-gray-600 line-through">₹{ride.fare}</p>
									<p className="text-sm font-bold text-green-600">
										₹
										{Math.max(
											ride.fare -
												(couponResponse.type === "fixed"
													? couponResponse.discount
													: (ride.fare * couponResponse.discount) / 100),
											0
										)}
									</p>
								</div>
							) : (
								<p className="text-sm text-gray-600">₹{ride.fare}</p>
							)}
						</div>
					</div>
				</div>

				<button
					onClick={handlePayment}
					className="w-full mt-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
					Make a Payment
				</button>
			</div>
		</div>
	);
};

export default Riding;
