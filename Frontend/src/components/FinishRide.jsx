/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const FinishRide = (props) => {
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    // Extract coupon details safely
    const coupon = props?.couponResponse;
    const discountAmount = coupon?.type === "percentage" 
        ? (props.ride?.fare * coupon.discount) / 100 
        : coupon?.discount;
    const discountedFare = discountAmount ? Math.max(props.ride?.fare - discountAmount, 0) : props.ride?.fare;

    async function endRide() {
		
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id,
			discountAmount:discountedFare
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.status === 200) {
            navigate('/captain-home');
        }
        
        socket.emit("clear-chat-message", {
            rideId: props.ride._id
        });
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <div className="relative">
                <button
                    className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition-colors"
                    onClick={() => props.setFinishRidePanel(false)}
                >
                    <ChevronDown size={30} strokeWidth={2} className="text-gray-600" />
                </button>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Ride</h3>

            {/* User Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <img
                        className="h-14 w-14 rounded-full object-cover border-2 border-green-100"
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt="User profile"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}
                    </h2>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {props.ride?.distance} KM
                </span>
            </div>

            {/* Ride Details */}
            <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-gray-100">
                    <i className="ri-map-pin-user-fill text-xl text-blue-500 mt-1"></i>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700">Pickup</h4>
                        <p className="text-sm text-gray-500">{props.ride?.originText}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-gray-100">
                    <i className="ri-map-pin-2-fill text-xl text-red-500 mt-1"></i>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700">Drop-off</h4>
                        <p className="text-sm text-gray-500">{props.ride?.destinationText}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-gray-100">
                    <i className="ri-currency-line text-xl text-green-500 mt-1"></i>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700">Payment</h4>
                        <div className="text-sm text-gray-600">
                            {coupon ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="line-through text-gray-400">₹{props.ride?.fare}</span>
                                        <span className="text-green-600 text-lg font-bold">₹{discountedFare}</span>
                                    </div>
                                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                        Coupon: {coupon.code}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-lg font-bold text-gray-700">₹{props.ride?.fare}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Finish Button */}
            <button
                onClick={endRide}
                className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
                Finish Ride
            </button>
        </div>
    );
};

export default FinishRide;