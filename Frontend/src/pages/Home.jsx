import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  // State variables for pickup, destination, suggestions, panels and more.
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [panelOpen, setPanelOpen] = useState(false); // Controls the search panel open/close
  const [vehiclePanel, setVehiclePanel] = useState(false); // Controls the vehicle selection panel
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState("");

  const [originCoordinates, setOriginCoordinates] = useState([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState([]);

  // Animation variants for the search panel (expanding/collapsing)
  const searchPanelVariants = {
    closed: { height: "0%", padding: 0,  transition: { type: "spring", stiffness: 200, damping: 35 } },
    open: { height: "70%", padding: 24, transition: { type: "spring", stiffness: 200, damping: 35 } }
  };

  // Animation variants for sliding panels from bottom
  const slideUpVariants = {
    hidden: { translateY: "100%",  transition: { type: "spring", stiffness: 200, damping: 35 } },
    visible: { translateY: 0,  transition: { type: "spring", stiffness: 200, damping: 35 } }
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
          console.log("fare", fareRes.data);

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

  // Function to create a ride request
  async function createRide() {
    console.log("ride", originCoordinates, "d", destinationCoordinates, vehicleType, pickup, destination);
    await axios.post(
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
    );
  }

  // Prevent form submission from reloading the page.
  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Uber logo */}
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber Logo"
      />
      {/* Background image */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Background"
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="min-h-[180px] p-6 bg-white relative flex flex-col">
          
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <div className="flex-1">
            <form className="relative py-3" onSubmit={submitHandler}>
              <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
              <input
                onFocus={handlePickupFocus}
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
          <button onClick={findTrip} className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
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
              className="bg-white overflow-hidden"
            >
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
            className="fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12"
          >
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
            className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
          >
            <ConfirmRide
              createRide={createRide}
              setConfirmRidePanel={setConfirmRidePanel}
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              setVehicleFound={setVehicleFound}
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
            className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
          >
            <LookingForDriver
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
            className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
          >
            <WaitingForDriver waitingForDriver={waitingForDriver} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
