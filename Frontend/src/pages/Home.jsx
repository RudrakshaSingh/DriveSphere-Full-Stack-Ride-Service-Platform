import { useState, useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import toast from "react-hot-toast";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import logo from "../assets/logo.png";
import UserMenuPanel from "../components/UserMenu/UserMenuPanel";
import MapComponent from "../components/MapComponent";

const Home = () => {
	const [pickup, setPickup] = useState("");
	const [destination, setDestination] = useState("");

	const [panelOpen, setPanelOpen] = useState(false); // Controls the search panel open/close
	const [vehiclePanel, setVehiclePanel] = useState(false); // Controls the vehicle selection panel
	const [confirmRidePanel, setConfirmRidePanel] = useState(false);
	const [vehicleFound, setVehicleFound] = useState(false);
	const [waitingForDriver, setWaitingForDriver] = useState(false);
	const [couponResponse, setCouponResponse] = useState("");

	const [pickupSuggestions, setPickupSuggestions] = useState([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState([]);
	const [activeField, setActiveField] = useState(null);
	const [fare, setFare] = useState({});
	const [vehicleType, setVehicleType] = useState("");

	const [originCoordinates, setOriginCoordinates] = useState([]);
	const [destinationCoordinates, setDestinationCoordinates] = useState([]);
	const [openMenu, setOpenMenu] = useState(false);

	const { socket } = useContext(SocketContext);
	const { user } = useContext(UserDataContext);

	const [ride, setRide] = useState(null);

	const pickupInputRef = useRef(null);

	const navigate = useNavigate();

	useEffect(() => {
		socket.emit("join", { userType: "user", userId: user._id });
	}, [user, socket]);

	useEffect(() => {
		socket.on("ride-confirmed", (ride) => {
			// console.log("ride-confirmed", ride);
			setRide(ride);
			setVehicleFound(false);
			setWaitingForDriver(true);
		});
	}, [ride, socket]);

	socket.on("ride-started", (ride) => {
		setWaitingForDriver(false);
		navigate("/riding", { state: { ride, couponResponse } }); // Updated navigate to include ride data)
	});

	// Animation variants for the search panel (expanding/collapsing)
	const searchPanelVariants = {
		closed: { height: "0%", padding: 0, transition: { type: "spring", stiffness: 200, damping: 35 } },
		open: { height: "70%", padding: 24, transition: { type: "spring", stiffness: 200, damping: 35 } },
	};

	// Animation variants for sliding panels from bottom
	const slideUpVariants = {
		hidden: { translateY: "100%", transition: { type: "spring", stiffness: 200, damping: 35 } },
		visible: { translateY: 0, transition: { type: "spring", stiffness: 200, damping: 35 } },
	};

	// Handlers for input changes and focus
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
			axios
				.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
					params: { address: inputValue },
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
				.then((response) => {
					const suggestions = response.data.message;
					if (suggestions.length === 0) {
						setPickupSuggestions([]);
						throw new Error("No matched suggestions found.");
					} else {
						setPickupSuggestions(suggestions);
						return "Suggestions fetched successfully!";
					}
				}),
			{
				loading: "Fetching suggestions...",
				success: (message) => message,
				error: (err) => err.message || "Failed to fetch suggestions. Please check your input.",
			},
			{
				id: "fetch-suggestions-toast", // Unique ID to prevent duplicates
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
			axios
				.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
					params: { address: inputValue },
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
				.then((response) => {
					const suggestions = response.data.message;
					if (suggestions.length === 0) {
						setDestinationSuggestions([]);
						throw new Error("No matched suggestions found.");
					} else {
						setDestinationSuggestions(suggestions);
						return "Suggestions fetched successfully!";
					}
				}),
			{
				loading: "Fetching suggestions...",
				success: (message) => message,
				error: (err) => err.message || "Failed to fetch suggestions. Please check your input.",
			},
			{
				id: "fetch-suggestions-toast", // Unique ID to prevent duplicates
			}
		);
	};

	// Function to calculate fare and get coordinates
	async function findTrip() {
		// Close the main panel before proceeding.
		setPanelOpen(false);

		try {
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

					// Save the fetched coordinates to state.
					setOriginCoordinates([originRes.data.message.longitude, originRes.data.message.latitude]);
					setDestinationCoordinates([destRes.data.message.longitude, destRes.data.message.latitude]);

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
					if (fareRes.data.message.distance > 1000) {
						throw new Error("DISTANCE_LIMIT_EXCEEDED");
					}

					return fareRes;
				})(),
				{
					loading: "Calculating your fare...",
					success: "Fare calculated successfully!",
					error: (err) => {
						if (err.message === "DISTANCE_LIMIT_EXCEEDED") {
							return "Rides above 1000km are not available";
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

	// Function to create a ride request
	async function createRide() {
		try {
			await toast.promise(
				axios.post(
					`${import.meta.env.VITE_BASE_URL}/rides/create`,
					{
						origin: originCoordinates,
						destination: destinationCoordinates,
						vehicleType,
						originText: pickup,
						destinationText: destination,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				),
				{
					loading: "Creating your ride...",
					success: () => {
						// Only show LookingForDriver panel after successful creation
						setVehicleFound(true);
						setConfirmRidePanel(false);
						return "Ride created successfully!";
					},
					error: "Failed to create ride.",
				}
			);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create ride in backend");
			setVehicleFound(false);
		}
	}

	// Function to get current location
	const getCurrentLocation = async () => {
		// Notify user that location fetching has started
		const loadingToastId = toast.loading("Fetching your current location...");

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				setOriginCoordinates([longitude, latitude]);

				try {
					const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/reverse-geocoding`, {
						params: { latitude, longitude },
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					if (response.status === 200) {
						setPickupSuggestions(response.data.message);
						setPanelOpen(true);
						if (pickupInputRef.current) {
							pickupInputRef.current.focus();
						}
						setPickup(response.data.message[0]);

						// Update the loading toast to success
						toast.success("Location fetched successfully", {
							id: loadingToastId,
						});
					} else {
						// Update the loading toast to error
						toast.error(response.data.message || "Failed to fetch location", {
							id: loadingToastId,
						});
					}
				} catch (error) {
					// Update the loading toast to error
					toast.error("An error occurred while fetching location", {
						id: loadingToastId,
					});
					console.error(error);
				}
			},
			(error) => {
				// Handle geolocation errors
				toast.error(`Geolocation error: ${error.message}`, {
					id: loadingToastId,
				});
			}
		);
	};
	// Prevent form submission from reloading the page.
	const submitHandler = (e) => {
		e.preventDefault();
	};

	const toggleMenu = () => {
		setOpenMenu((prevState) => !prevState);
	};

	return (
		<div className="h-screen relative overflow-hidden">
			<div className="absolute top-5 left-3 right-3 z-10  flex flex-row justify-between items-center">
				<img height={80} width={150} src={logo} alt="DriveSphere Logo" />
				<button
					onClick={toggleMenu}
					className="flex items-center justify-center p-2 bg-white rounded-full shadow-md transition transform duration-200 hover:bg-gray-100 hover:scale-105 focus:outline-none">
					<Menu size={30} strokeWidth={2} className="text-gray-700" />
				</button>
			</div>

			<UserMenuPanel openMenu={openMenu} toggleMenu={toggleMenu} user={user} />

			{/* Background map */}
			<div className="h-3/5 w-screen  ">
				<MapComponent vehiclePanel={vehiclePanel} pickup={originCoordinates} drop={destinationCoordinates} />
			</div>

			<div
				className={`flex flex-col justify-end  absolute  w-full  ${
					panelOpen ? "h-screen top-0 z-20" : "h-auto "
				}`}>
				<div className="min-h-[180px] pb-6 pl-6 pr-6 pt-2 bg-white relative flex flex-col  h-2/5  ">
					<h4 className="text-2xl font-semibold">Find a trip</h4>
					<div className="flex-1">
						<form className="relative py-3" onSubmit={submitHandler}>
							<div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
							<input
								onFocus={handlePickupFocus}
								ref={pickupInputRef}
								onClick={() => setPanelOpen(true)}
								value={pickup}
								onChange={handlePickupChange}
								className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
								type="text"
								placeholder="Add a pick-up location"
							/>
							<input
								onFocus={handleDestinationFocus}
								onClick={() => setPanelOpen(true)}
								value={destination}
								onChange={handleDestinationChange}
								className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
								type="text"
								placeholder="Enter your destination"
							/>
						</form>
					</div>
					<button
						onClick={getCurrentLocation}
						className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-lg mt-1 mb-2 w-full">
						Get Current Location
					</button>
					<button
						onClick={findTrip}
						className="bg-gradient-to-r from-gray-500 to-gray-400 text-white px-4 py-2 rounded-lg w-full">
						Find Trip
					</button>
				</div>
				{/* Animate and render the LocationSearchPanel */}
				<AnimatePresence>
					{panelOpen && (
						<motion.div
							key="search-panel"
							initial="closed"
							animate="open"
							exit="closed"
							variants={searchPanelVariants}
							className="bg-white overflow-hidden">
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
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Animate and render the VehiclePanel */}
			<AnimatePresence>
				{vehiclePanel && (
					<motion.div
						key="vehicle-panel"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={slideUpVariants}
						className="fixed w-full z-20 bottom-0 bg-white">
						<VehiclePanel
							setVehicleType={setVehicleType}
							fare={fare}
							setConfirmRidePanel={setConfirmRidePanel}
							setVehiclePanel={setVehiclePanel}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Animate and render the ConfirmRide panel */}
			<AnimatePresence>
				{confirmRidePanel && (
					<motion.div
						key="confirm-ride-panel"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={slideUpVariants}
						className="fixed w-full z-20 bottom-0 bg-white ">
						<ConfirmRide
							couponResponse={couponResponse}
							setCouponResponse={setCouponResponse}
							createRide={createRide}
							setConfirmRidePanel={setConfirmRidePanel}
							pickup={pickup}
							destination={destination}
							fare={fare}
							vehicleType={vehicleType}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Animate and render the LookingForDriver panel */}
			<AnimatePresence>
				{vehicleFound && (
					<motion.div
						key="vehicle-found-panel"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={slideUpVariants}
						className="fixed w-full z-20 bottom-0 bg-white ">
						<LookingForDriver
							couponResponse={couponResponse}
							setCouponResponse={setCouponResponse}
							createRide={createRide}
							pickup={pickup}
							destination={destination}
							fare={fare}
							vehicleType={vehicleType}
							setVehicleFound={setVehicleFound}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Animate and render the WaitingForDriver panel */}
			<AnimatePresence>
				{waitingForDriver && (
					<motion.div
						key="waiting-for-driver-panel"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={slideUpVariants}
						className="fixed w-full z-20 bottom-0 bg-white">
						<WaitingForDriver
							couponResponse={couponResponse}
							setCouponResponse={setCouponResponse}
							ride={ride}
							setVehicleFound={setVehicleFound}
							waitingForDriver={waitingForDriver}
							setWaitingForDriver={setWaitingForDriver}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Home;
