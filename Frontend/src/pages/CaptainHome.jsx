import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(true)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    // Define animation variants for sliding panels from the bottom.
    const slideUpVariants = {
        hidden: { y: "100%", transition: { type: "spring", stiffness: 200, damping: 35 } },
        visible: { y: 0, transition: { type: "spring", stiffness: 200, damping: 35 } }
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
                            setRidePopupPanel={setRidePopupPanel}  
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
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
