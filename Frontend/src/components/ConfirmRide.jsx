/* eslint-disable react/prop-types */
import { ChevronDown, MapPin, IndianRupee } from "lucide-react";
import car from "../assets/car.png";
import moto from "../assets/moto.png";
import auto from "../assets/auto.png";

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

  return (
	<div className="flex flex-col h-full">
	  <div className="bg-white rounded-t-2xl shadow-md p-4 relative">
		<button
		  className="absolute top-3 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md"
		  onClick={() => {
			props.setConfirmRidePanel(false);
		  }}
		>
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

		  <div className="flex items-center gap-3 py-3">
			<div className="w-8 h-8 flex items-center justify-center">
			  <IndianRupee size={20} className="text-yellow-600" />
			</div>
			<div>
			  <h4 className="text-md font-semibold text-gray-800">Payment</h4>
			  <p className="text-sm text-gray-600">₹{props.fare[props.vehicleType]} </p>
			</div>
		  </div>
		</div>

		<button
		  onClick={() => {
			props.createRide();
		  }}
		  className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors"
		>
		  Confirm Ride
		</button>
	  </div>
	</div>
  );
};

export default ConfirmRide;
