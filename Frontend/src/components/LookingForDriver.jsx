import { ChevronDown } from "lucide-react";

/* eslint-disable react/prop-types */
const LookingForDriver = (props) => {

	// Determine the image based on vehicleType
	let vehicleImg = "";
	if (props.vehicleType === "car") {
		vehicleImg = "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg";
	} else if (props.vehicleType === "moto") {
		vehicleImg =
			"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png";
	} else if (props.vehicleType === "auto") {
		vehicleImg =
			"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png";
	}

	return (
		<div >
			<h5
				className="p-1 text-center w-[93%] absolute top-0 items-center flex justify-center"
				onClick={() => {
					props.setVehicleFound(false);
				}}>
				<ChevronDown size={35} strokeWidth={2.1} />
			</h5>
			<h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
			<div className="flex gap-2 justify-between flex-col items-center">
			<img className="h-20" src={vehicleImg} alt="" />
				<div className="w-full mt-5">
					<div className="flex items-center gap-5 p-3 border-b-2">
						<i className="ri-map-pin-user-fill"></i>
						<div>
							<h3 className="text-lg font-medium">Pickup</h3>
							<p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
						</div>
					</div>
					<div className="flex items-center gap-5 p-3 border-b-2">
						<i className="text-lg ri-map-pin-2-fill"></i>
						<div>
							<h3 className="text-lg font-medium">Destination</h3>
							<p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
						</div>
					</div>
					<div className="flex items-center gap-5 p-3">
						<i className="ri-currency-line"></i>
						<div>
							<h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]} </h3>
							<p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LookingForDriver;
