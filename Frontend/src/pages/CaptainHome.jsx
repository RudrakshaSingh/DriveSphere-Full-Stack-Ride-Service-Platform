import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { SocketContext } from '../context/SocketContext'
import { useContext, useEffect } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)
    useEffect(() => {
        if (!socket || !captain?._id) return;
    
        // console.log('Initializing captain socket...');
    
        // Join room
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });
    
        // Location updates
        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    // console.log('Sending location:', position.coords);
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude
                        }
                    });
                },
                error => {
                    console.error('Location error:', error);
                }
            );
        };
    
        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation(); // Initial update
    
        // Event listeners
        const handleNewRide = (data) => {
            console.log('New ride request:', data);
            setRide(data);
            setRidePopupPanel(true);
            // Handle ride request here
        };
    
        socket.on('new-ride', handleNewRide);
    
        // Cleanup
        return () => {
            console.log('Cleaning up captain socket...');
            clearInterval(locationInterval);
            socket.off('new-ride', handleNewRide);
        };
    }, [socket, captain?._id]); // Only depend on _id

    // Define animation variants for sliding panels from the bottom.
    const slideUpVariants = {
        hidden: { y: "100%", transition: { type: "spring", stiffness: 200, damping: 35 } },
        visible: { y: 0, transition: { type: "spring", stiffness: 200, damping: 35 } }
    }

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }


    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img 
                    className='w-16' 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                    alt="Uber Logo" 
                />
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img 
                    className='h-full w-full object-cover' 
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
                    alt="Background" 
                />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            {/* Animate and render the RidePopUp panel */}
            <AnimatePresence>
                {ridePopupPanel && (
                    <motion.div
                        key="ride-popup-panel"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideUpVariants}
                        className='fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12'
                    >
                        <RidePopUp 
                        ride={ride}
                            setRidePopupPanel={setRidePopupPanel}  
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                            confirmRide={confirmRide}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Animate and render the ConfirmRidePopUp panel */}
            <AnimatePresence>
                {confirmRidePopupPanel && (
                    <motion.div
                        key="confirm-ride-popup-panel"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideUpVariants}
                        className='fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 pt-12'
                    >
                        <ConfirmRidePopUp 
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                            setRidePopupPanel={setRidePopupPanel} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CaptainHome;
