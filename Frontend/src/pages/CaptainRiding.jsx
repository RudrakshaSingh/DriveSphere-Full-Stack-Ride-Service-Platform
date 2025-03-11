import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserHistoryMap from "../components/UserMenu/UserHistoryMap";
import logo from "../assets/logo.png";
import { House } from "lucide-react";

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const location = useLocation();
    const rideData = location.state?.ride || {
        _id: "67d044300f2d66952ae393ca",
        pickup: "NCPL Web Tower, Noida, UP, India", // Changed to match your data
        destination: "Jamnagar",
        status: "In Progress",
    }; // Fallback data if location.state is unavailable
    const couponResponse = location.state?.couponResponse || {};
    const [pickup, setPickup] = useState("");

    // Animation variants
    const slideUpVariants = {
        hidden: { y: "100%", transition: { type: "spring", stiffness: 200, damping: 35 } },
        visible: { y: 0, transition: { type: "spring", stiffness: 200, damping: 35 } },
    };

    // Update pickup with browser's current location every 10 seconds
    useEffect(() => {
        const updatePickup = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickup([longitude, latitude]);
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        };

        updatePickup();
        const intervalId = setInterval(updatePickup, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="h-screen relative flex flex-col">
            <div className="fixed p-2 top-0 flex items-center justify-between w-screen z-50">
                <img height={80} width={150} src={logo} alt="DriveSphere Logo" />
                
                <Link to="/captain-home" className=" h-10 w-10 bg-white flex items-center justify-center rounded-full">
                   
                    <House />
                </Link>
            </div>
            <div className="h-4/5">
				<UserHistoryMap pickup={pickup} drop={rideData?.destination} />
			
            </div>

            {/* Ride Info and Button - Positioned at bottom */}
            <div className="flex-1 flex flex-col justify-end relative z-10">
                <div className="bg-amber-300 p-4 flex flex-col items-center justify-between shadow-inner">
                    <div className="text-center text-gray-800">
                        <h4 className="text-lg font-semibold">Ride ID: {rideData._id}</h4>
                        <p className="text-sm font-medium text-green-600 mt-1">
                            <span className="font-medium text-black">Current status: </span> {rideData.status}
                        </p>
                        <div className="mt-2">
                            <p className="text-sm">
                                <span className="font-medium">Pickup:</span> {rideData.pickup} {/* Changed from originText */}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Destination:</span> {rideData.destination} {/* Changed from destinationText */}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setFinishRidePanel(true)}
                        className="bg-green-500 text-white font-semibold py-3 px-14 rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 mt-4"
                    >
                        Complete Ride
                    </button>
                </div>
            </div>

            {/* Finish Ride Panel */}
            <AnimatePresence>
                {finishRidePanel && (
                    <motion.div
                        key="finish-ride-panel"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideUpVariants}
                        className="fixed w-full bottom-0 bg-white px-4 py-8 z-20 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
                    >
                        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} couponResponse={couponResponse} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaptainRiding;