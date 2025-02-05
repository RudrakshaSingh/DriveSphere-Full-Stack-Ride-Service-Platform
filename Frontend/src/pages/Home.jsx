import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import { ChevronDown } from "lucide-react";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
	const [pickup, setPickup] = useState("");
	const [destination, setDestination] = useState("");

	const [panelOpen, setPanelOpen] = useState(false); //goes up and down
	const [vehiclePanel, setVehiclePanel] = useState(false); //when user clicks on location to select vechile
	const [confirmRidePanel, setConfirmRidePanel] = useState(false);
	const [vehicleFound, setVehicleFound] = useState(false);
	const [waitingForDriver, setWaitingForDriver] = useState(false);

	const [pickupSuggestions, setPickupSuggestions] = useState([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState([]);
	const [activeField, setActiveField] = useState(null);
	const [fare, setFare] = useState({});
	const [vehicleType, setVehicleType] = useState(null);
	const [ride, setRide] = useState(null);

	const vehiclePanelRef = useRef(null);
	const confirmRidePanelRef = useRef(null);
	const panelRef = useRef(null); //used to pick one div by adding ref={panelRef} in that div
	const panelCloseRef = useRef(null);
	const vehicleFoundRef = useRef(null); //foor when pressed looking for a driver
	const waitingForDriverRef = useRef(null);

	const handlePickupChange = (e) => {
		const inputValue = e.target.value;
		setPickup(inputValue);

		// Only trigger API call if input length is at least 3 characters
		if (inputValue.length >= 3) {
			fetchSuggestions(inputValue);
		} else {
			setPickupSuggestions([]); // Clear suggestions when input is less than 3
		}
	};

	const fetchSuggestions = async (inputValue) => {
		await toast.promise(
			axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
				params: { address: inputValue },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			{
				loading: "Fetching suggestions...",
				success: (response) => {
					setPickupSuggestions(response.data.message);

					return "Suggestions fetched successfully!";
				},
				error: "Failed to fetch suggestions. Please check your input.",
			}
		);
	};

	const handlePickupFocus = () => {
		setActiveField("pickup");
	};

	const handleDestinationFocus = () => {
		setActiveField("destination");
	};

	const handleDestinationChange = (e) => {
		const inputValue = e.target.value;
		setDestination(inputValue);

		// Only trigger API call if input length is at least 3 characters
		if (inputValue.length >= 3) {
			fetchDestinationSuggestions(inputValue);
		} else {
			setDestinationSuggestions([]); // Clear suggestions when input is less than 3
		}
	};

	const fetchDestinationSuggestions = async (inputValue) => {
		await toast.promise(
			axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
				params: { address: inputValue },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			{
				loading: "Fetching suggestions...",
				success: (response) => {
					setDestinationSuggestions(response.data.message);
					return "Suggestions fetched successfully!";
				},
				error: "Failed to fetch suggestions. Please check your input.",
			}
		);
	};

	async function findTrip() {
		// Close the main panel before proceeding.
		setPanelOpen(false);
	
		try {
			// Wrap the asynchronous logic inside toast.promise.
			const fareRes = await toast.promise(
				(async () => {
					// Get coordinates for both locations in parallel.
					const [originRes, destRes] = await Promise.all([
						axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
							params: { address: pickup },
							headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
						}),
						axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
							params: { address: destination },
							headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
						}),
					]);
	
					// Check if origin and destination are the same.
					if (
						originRes.data.message.latitude === destRes.data.message.latitude &&
						originRes.data.message.longitude === destRes.data.message.longitude
					) {
						throw new Error("SAME_COORDINATES");
					}
	
					// Get fare estimate using the coordinates.
					const fareRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
						params: {
							originLatitute: originRes.data.message.latitude,
							originLongitude: originRes.data.message.longitude,
							destinationLatitude: destRes.data.message.latitude,
							destinationLongitude: destRes.data.message.longitude,
						},
						headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					});
	
					// Check the distance limit.
					if (fareRes.data.message.distance > 200) {
						throw new Error("DISTANCE_LIMIT_EXCEEDED");
					}
	
					return fareRes;
				})(),
				{
					loading: "Calculating your fare...",
					success: "Fare calculated successfully!",
					error: (err) => {
						if (err.message === "DISTANCE_LIMIT_EXCEEDED") {
							return "Rides above 100km are not available";
						}
						if (err.message === "SAME_COORDINATES") {
							return "Origin and destination cannot be of same coordinates";
						}
						return err.response?.data?.message || "Failed to calculate fare";
					},
				}
			);
	
			// If no error, set the fare and open the vehicle panel.
			setFare(fareRes.data.message.fare);
			setVehiclePanel(true);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to calculate fare");
			setVehiclePanel(false);
		}
	}
	
	// async function createRide() {
	//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
	//         pickup,
	//         destination,
	//         vehicleType
	//     }, {
	//         headers: {
	//             Authorization: `Bearer ${localStorage.getItem('token')}`
	//         }
	//     })
	//     console.log("ride",response.data.message)
	// }

	const submitHandler = (e) => {
		e.preventDefault();
	};

	useGSAP(
		function () {
			if (panelOpen) {
				gsap.to(panelRef.current, {
					height: "70%",
					padding: 24, // opacity:1
				});
				gsap.to(panelCloseRef.current, {
					//to show arrow down when panel is up
					opacity: 1,
				});
			} else {
				gsap.to(panelRef.current, {
					height: "0%",
					padding: 0,
					// opacity:0
				});
				gsap.to(panelCloseRef.current, {
					opacity: 0,
				});
			}
		},
		[panelOpen]
	);

	useGSAP(
		function () {
			if (vehiclePanel) {
				gsap.to(vehiclePanelRef.current, {
					transform: "translateY(0)",
				});
			} else {
				gsap.to(vehiclePanelRef.current, {
					transform: "translateY(100%)",
				});
			}
		},
		[vehiclePanel]
	);

	useGSAP(
		function () {
			if (confirmRidePanel) {
				gsap.to(confirmRidePanelRef.current, {
					transform: "translateY(0)",
				});
			} else {
				gsap.to(confirmRidePanelRef.current, {
					transform: "translateY(100%)",
				});
			}
		},
		[confirmRidePanel]
	);

	useGSAP(
		function () {
			if (vehicleFound) {
				gsap.to(vehicleFoundRef.current, {
					transform: "translateY(0)",
				});
			} else {
				gsap.to(vehicleFoundRef.current, {
					transform: "translateY(100%)",
				});
			}
		},
		[vehicleFound]
	);

	useGSAP(
		function () {
			if (waitingForDriver) {
				gsap.to(waitingForDriverRef.current, {
					transform: "translateY(0)",
				});
			} else {
				gsap.to(waitingForDriverRef.current, {
					transform: "translateY(100%)",
				});
			}
		},
		[waitingForDriver]
	);

	return (
		<div className="h-screen relative overflow-hidden">
			<img
				className="w-16 absolute left-5 top-5"
				src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
				alt=""
			/>
			<div className="h-screen w-screen">
				{/* image for temporary use  */}
				<img
					className="h-full w-full object-cover"
					src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
					alt=""
				/>
			</div>
			<div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
				<div className="min-h-[180px] p-6 bg-white relative flex flex-col">
					<h5
						ref={panelCloseRef}
						onClick={() => {
							setPanelOpen(false);
						}}
						className="absolute opacity-0 right-6 top-6 text-2xl">
						<ChevronDown size={35} strokeWidth={2.1} />
					</h5>
					<h4 className="text-2xl font-semibold">Find a trip</h4>
					<div className="flex-1 ">
						<form
							className="relative py-3"
							onSubmit={(e) => {
								submitHandler(e);
							}}>
							<div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
							<input
								onFocus={handlePickupFocus}
								onClick={() => {
									setPanelOpen(true);
								}}
								value={pickup}
								onChange={handlePickupChange}
								className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
								type="text"
								placeholder="Add a pick-up location"
							/>
							<input
								onFocus={handleDestinationFocus}
								onClick={() => {
									setPanelOpen(true);
								}}
								value={destination}
								onChange={handleDestinationChange}
								className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
								type="text"
								placeholder="Enter your destination"
							/>
						</form>
					</div>
					<button onClick={findTrip} className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
						Find Trip
					</button>
				</div>

				<div ref={panelRef} className="bg-white h-0">
					<LocationSearchPanel
						setPanelOpen={setPanelOpen}
						pickupSuggestions={pickupSuggestions}
						setPickup={setPickup}
						setDestination={setDestination}
						activeField={activeField}
						destinationSuggestions={destinationSuggestions}
						pickup={pickup}
						destination={destination}
					/>
				</div>
			</div>
			<div
				ref={vehiclePanelRef}
				className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
				<VehiclePanel fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
			</div>
			<div
				ref={confirmRidePanelRef}
				className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
				<ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
			</div>
			<div ref={vehicleFoundRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
				<LookingForDriver setVehicleFound={setVehicleFound} />
			</div>
			<div ref={waitingForDriverRef} className="fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12">
				<WaitingForDriver waitingForDriver={waitingForDriver} />
			</div>
		</div>
	);
};

export default Home;
