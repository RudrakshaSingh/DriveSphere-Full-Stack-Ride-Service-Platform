/* eslint-disable react/prop-types */
import { ChevronDown, Users, Clock, Sparkles } from "lucide-react";
import car from "../assets/car.png";
import moto from "../assets/moto.png";
import auto from "../assets/auto.png";

const VehiclePanel = (props) => {
	const vehicleOptions = [
		{
			type: "car",
			name: "Premium Sedan",
			image: car,
			seats: 4,
			time: 3,
			comfort: "Comfort ride",
			fare: props.fare.car,
		},
		{
			type: "moto",
			name: "Bike",
			image: moto,
			seats: 1,
			time: 2,
			comfort: "Quick ride",
			fare: props.fare.moto,
		},
		{
			type: "auto",
			name: "Auto",
			image: auto,
			seats: 3,
			time: 1,
			comfort: "Best value",
			fare: props.fare.auto,
		},
	];

	return (
		<div className="px-4 pt-6 pb-4">
			<button
				className="absolute top-3 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md"
				onClick={() => props.setVehiclePanel(false)}
				aria-label="Close panel">
				<ChevronDown size={28} className="text-gray-700" />
			</button>

			<h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center mt-10">Select your ride</h3>

			<div className="space-y-3">
				{vehicleOptions.map((vehicle) => (
					<button
						key={vehicle.type}
						onClick={() => {
							props.setConfirmRidePanel(true);
							props.setVehicleType(vehicle.type);
							props.setVehiclePanel(false);
						}}
						className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 active:bg-gray-50 transition-all duration-200 shadow-sm">
						<img className="h-16 w-16 object-cover rounded-lg" src={vehicle.image} alt={vehicle.name} />
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between mb-1">
								<h4 className="font-semibold text-lg text-gray-900 truncate">{vehicle.name}</h4>
								<span className="text-base font-semibold text-gray-900 whitespace-nowrap">
									₹{vehicle.fare}
								</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<span className="flex items-center whitespace-nowrap">
									<Clock size={16} className="mr-1 text-green-500" />
									{vehicle.time} min
								</span>
								<span className="flex items-center whitespace-nowrap">
									<Users size={16} className="mr-1" />
									{vehicle.seats} Seats
								</span>
								<span className="flex items-center truncate">
									<Sparkles size={16} className="mr-1 text-purple-500" />
									{vehicle.comfort}
								</span>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default VehiclePanel;
