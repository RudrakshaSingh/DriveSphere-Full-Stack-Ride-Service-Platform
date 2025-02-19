import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import {  useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserHistoryMap from "../components/UserMenu/UserHistoryMap";
import logo from "../assets/logo.png";
import { House } from "lucide-react";

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);

    const location = useLocation()
    const rideData = location.state?.ride
	const [pickup, setPickup] = useState("");

    


    // Animation variants matching CaptainHome
    const slideUpVariants = {
        hidden: { y: "100%", transition: { type: "spring", stiffness: 200, damping: 35 } },
        visible: { y: 0, transition: { type: "spring", stiffness: 200, damping: 35 } }
    };
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
    return (
        <div className="h-screen relative">
            <div className="fixed p-2 top-0 flex items-center justify-between w-screen z-50">
                <img height={80} width={150} src={logo} alt="DriveSphere Logo" />
                
                <Link to="/captain-home" className=" h-10 w-10 bg-white flex items-center justify-center rounded-full">
                   
                    <House />
                </Link>
            </div>
            <div className="h-4/5">
				<UserHistoryMap pickup={pickup} drop={rideData?.destination} />
			
            </div>
            <div
                className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10  "
                >
                <div className="flex flex-col items-center gap-1 justify-center"><h4 className="text-lg font-semibold">{rideData ? `Ride ID: ${rideData._id}` : '4 KM away'}</h4>
                <button onClick={() => {
                    setFinishRidePanel(true);
                }} className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">Complete Ride</button></div>
            </div>

            <AnimatePresence>
                {finishRidePanel && (
                    <motion.div
                        key="finish-ride-panel"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideUpVariants}
                        className="fixed w-full z-20 bottom-0 bg-white px-3 py-10 pt-12"
                    >
                        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaptainRiding;