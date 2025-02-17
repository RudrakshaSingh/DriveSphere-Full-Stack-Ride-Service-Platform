{
	/* eslint-disable react-hooks/exhaustive-deps */
}
import { useContext, useEffect, useState } from "react";
import {
	Clock,
	MapPin,
	Car,
	Star,
	Calendar,
	Navigation,
	Receipt,
	IndianRupee,
	ArrowDownUp,
	MapPin as MapPinHouse,
	Phone,
	ArrowLeft,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserDataContext } from "../../context/UserContext";
import UserHistoryMap from "./UserHistoryMap";

const RideHistory = () => {
  const navigate = useNavigate();
	const [expandedRide, setExpandedRide] = useState(null);
	const [rideHistoryData, setRideHistoryData] = useState(null);
	const { user } = useContext(UserDataContext);
	const token = localStorage.getItem("token");

	const fetchUserDataRideHistory = async () => {
		await toast
			.promise(
				axios.get(`${import.meta.env.VITE_BASE_URL}/users/ridehistory`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				{
					loading: "Fetching ride data. Please wait...",
					success: "Fetching ride data successful!",
					error: "Error during fetching ride userdata",
				}
			)
			.then((response) => {
				if (response.status === 200) {
					const data = response.data.message;
					setRideHistoryData(data);
				}
			});
	};

	useEffect(() => {
		fetchUserDataRideHistory();
	}, []);

	if (!rideHistoryData) {
		return (
			<div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
				<div className="text-lg font-medium text-gray-600 bg-white px-8 py-4 rounded-lg shadow-md">
					Loading ride history...
				</div>
			</div>
		);
	}

	const rides = rideHistoryData.map((ride) => ({
		id: ride._id,
    captainId: ride.captain._id,
		fname: ride?.captain?.fullname?.firstname,
		lname: ride?.captain?.fullname?.lastname,
		mobile: ride?.captain?.mobileNumber,
		vehicleType: ride?.captain?.vehicle?.vehicleType,
		vehiclePlate: ride?.captain?.vehicle?.plate,
		vehicleModel: ride?.captain?.vehicle?.model,
		vehicleColor: ride?.captain?.vehicle?.color,
		captainImage: ride?.captain?.profileImage,
		date: new Date(ride?.createdAt).toLocaleDateString(),
		time: new Date(ride?.createdAt).toLocaleTimeString(),
		from: ride?.originText,
		to: ride?.destinationText,
		fare: ride?.fare,
		duration: ride?.duration,
		distance: ride?.distance,
		rating: ride?.feedback?.overallExperience ?? 0, // Set default rating to 0 if undefined or null
		payment: ride?.paymentID ? `•••• ${ride.paymentID}` : "XXXX",
		pickup: ride?.origin,
		drop: ride?.destination,
		invoiceLink: "#",
	}));
	console.log(rides);

	const stats = [
		{
			icon: Car,
			value: `${user?.ridesCompleted || 0}`,
			label: "Total Rides",
			bgColor: "bg-indigo-50",
			iconColor: "text-indigo-600",
			valueColor: "text-indigo-700",
		},
		{
			icon: IndianRupee,
			value: `${user?.totalMoneySpend || 0}`,
			label: "Total Spent",
			bgColor: "bg-emerald-50",
			iconColor: "text-emerald-600",
			valueColor: "text-emerald-700",
		},
		{
			icon: ArrowDownUp,
			value: `${user?.totalDistance || 0} Km`,
			label: "Distance",
			bgColor: "bg-violet-50",
			iconColor: "text-violet-600",
			valueColor: "text-violet-700",
		},
		{
			icon: Clock,
			value: `${(user?.totalTime / 60).toFixed(2) || 0} Hrs`,
			label: "Time",
			bgColor: "bg-amber-50",
			iconColor: "text-amber-600",
			valueColor: "text-amber-700",
		},
	];

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-30 overflow-auto">
			{/* Header */}
			<div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-10">
				<button
					onClick={() => window.history.back()}
					className="absolute left-4 p-2.5 top-4 hover:bg-white/10 rounded-full transition-colors"
					aria-label="Go back">
					<ArrowLeft size={24} className="text-white" />
				</button>
				<div className="max-w-2xl mx-auto px-4 py-8">
					<div className="flex flex-col items-center justify-center text-center space-y-4">
						<h1 className="text-3xl font-bold text-white">Your Rides</h1>
						<p className="text-blue-100 text-sm max-w-md">
							Track your journey history and manage your rides all in one place
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
				{/* Stats Overview */}
				<div className="grid grid-cols-2 gap-3">
					{stats.map((stat, index) => (
						<div
							key={index}
							className={`${stat.bgColor} p-4 rounded-xl shadow-md border border-white/50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}>
							<div className="flex items-center gap-3">
								<div
									className={`p-2.5 rounded-lg bg-white/90 backdrop-blur-sm ${stat.iconColor} shadow-sm`}>
									<stat.icon className="w-5 h-5" />
								</div>
								<div>
									<div className={`text-lg font-bold ${stat.valueColor}`}>{stat.value}</div>
									<div className="text-xs font-medium text-gray-600">{stat.label}</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Ride List */}
				<div className="space-y-4">
					{rides.map((ride) => (
						<div
							key={ride.id}
							className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-white/50">
							{/* Ride Summary */}
							<div
								className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
								onClick={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}>
								<div className="flex items-center justify-between">
									<div className="space-y-3">
										<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full">
											<Calendar className="w-4 h-4" />
											<span>{ride.date}</span>
											<span>•</span>
											<span>{ride.time}</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex flex-col space-y-2">
												<div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
													<MapPinHouse className="w-4 h-4 text-emerald-600" />
													<span className="text-sm font-medium truncate max-w-[200px] text-emerald-700">
														{ride.from}
													</span>
												</div>
												<div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
													<MapPin className="w-4 h-4 text-red-600" />
													<span className="text-sm font-medium truncate max-w-[200px] text-red-700">
														{ride.to}
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
											₹{ride.fare}
										</div>
										{expandedRide === ride.id ? (
											<ChevronUp className="w-5 h-5 text-gray-400" />
										) : (
											<ChevronDown className="w-5 h-5 text-gray-400" />
										)}
									</div>
								</div>
							</div>

							{/* Expanded Details */}
							{expandedRide === ride.id && (
								<div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
									<div className="text-xs text-gray-500">Ride ID: {ride.id}</div>

									{/* Route Map */}
									<div className="relative rounded-lg overflow-hidden shadow-md">
										<div className="w-full h-40 object-cover">
											<UserHistoryMap pickup={ride.pickup} drop={ride.drop} />
										</div>
										<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
										<div className="absolute bottom-4 left-4 right-4 flex justify-between text-white">
											<div className="flex items-center gap-2">
												<Navigation className="w-4 h-4" />
												<span className="text-sm font-medium">{ride.distance} km</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4" />
												<span className="text-sm font-medium">{ride.duration} mins</span>
											</div>
										</div>
									</div>

									{/* Driver Details */}
									<div className="bg-white p-4 rounded-lg space-y-4 shadow-sm">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<img
													src={ride.captainImage}
													alt="Driver"
													className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
												/>
												<div>
													<div className="text-xs text-gray-500">YOUR DRIVER</div>
													<div className="font-medium text-gray-900">
														{ride.fname} {ride.lname}
													</div>
												</div>
											</div>
											<button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm">
												<a href={`tel:+91 ${ride.mobile}`}>
													<Phone className="w-5 h-5" />
												</a>
											</button>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="bg-gray-50 p-3 rounded-lg">
												<div className="text-xs text-gray-500">VEHICLE</div>
												<div className="font-medium text-gray-900">
													{ride.vehicleColor} {ride.vehicleModel}
												</div>
											</div>
											<div className="bg-gray-50 p-3 rounded-lg">
												<div className="text-xs text-gray-500">PLATE</div>
												<div className="font-medium text-gray-900">{ride.vehiclePlate}</div>
											</div>
										</div>
									</div>

									{/* Payment & Rating */}
									<div className="flex justify-between bg-white p-4 rounded-lg shadow-sm">
										<div>
											<div className="text-xs text-gray-500">PAYMENT</div>
											<div className="font-medium text-gray-900">{ride.payment}</div>
										</div>
										{ride.rating > 0 ? (
											<div>
												<div className="text-xs text-gray-500">YOUR RATING</div>
												<div className="flex items-center gap-1">
													{Array.from({ length: 5 }).map((_, i) => (
														<Star
															key={i}
															className={`w-4 h-4 ${
																i < Math.floor(ride.rating)
																	? "fill-yellow-400 text-yellow-400"
																	: "text-gray-300"
															}`}
														/>
													))}
												</div>
											</div>
										) : (
											<button
												onClick={() => navigate("/user-feedback",{ state: { rideId: ride.id, captainId: ride.captainId, type: false } })}
												className="text-blue-500 hover:underline">
												Give Feedback
											</button>
										)}
									</div>

									{/* Actions */}
									<button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
										<Receipt className="w-5 h-5" />
										Download Receipt
									</button>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Footer */}
				<div className="text-center border-t border-gray-200/50 pt-6 pb-4">
					<p className="text-xs text-gray-500 mb-2">© 2025 DriveSphere Rides. All rights reserved.</p>
					<div className="flex justify-center items-center space-x-4 text-xs">
						<Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 transition-colors">
							Privacy Policy
						</Link>
						<span className="text-gray-300">•</span>
						<Link to="/terms-of-service" className="text-blue-600 hover:text-blue-700 transition-colors">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RideHistory;
