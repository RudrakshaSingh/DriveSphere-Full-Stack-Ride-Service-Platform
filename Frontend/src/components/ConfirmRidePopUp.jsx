/* eslint-disable react/prop-types */
import axios from "axios";
import { MessageCircleMore } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./Chat/ChatComponent";
import toast from "react-hot-toast";

const ConfirmRidePopUp = (props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const coupon = props.ride?.couponResponse;
  const discountAmount = coupon?.type === "percentage"
    ? (props.ride?.fare * coupon.discount) / 100
    : coupon?.discount;
  const discountedFare = discountAmount ? Math.max(props.ride?.fare - discountAmount, 0) : props.ride?.fare;

  const submitHander = async (e) => {
    e.preventDefault();
  };

  const confirmRide = async () => {
    const otpString = otp.join("");
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
      params: { rideId: props.ride._id, otp: otpString },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.status === 200) {
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: response.data } });
    } else if (response.status === 201) {
      toast.error(response.data.message);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-xl overflow-y-auto z-50">
      <div className="sticky top-0 bg-white pt-4 pb-3 flex justify-center border-b border-gray-200">
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          onClick={() => props.setRidePopupPanel(false)}
        >
          <i className="ri-arrow-down-wide-line text-3xl text-gray-600"></i>
        </button>
      </div>

      <div className="px-6 pb-6 pt-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">
          Confirm Ride to Start
        </h3>

        {/* User Details */}
        <div className="bg-amber-50 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <img
              className="h-14 w-14 rounded-full object-cover ring-2 ring-amber-200 transition-all duration-200 hover:scale-105"
              src={props.ride?.user.profileImage}
              alt="User profile"
            />
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {props.ride?.user.fullname.firstname}
            </h2>
          </div>
          <div className="text-right">
            <h5 className="text-sm font-medium text-gray-700">Distance: {props.ride?.distance} KM</h5>
            <h5 className="text-sm font-medium text-gray-700">Duration: {props.ride?.duration} Min</h5>
          </div>
        </div>

        {/* Ride Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl shadow-sm">
            <i className="ri-map-pin-user-fill text-2xl text-blue-500 mt-1"></i>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">Pickup</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{props.ride?.originText}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl shadow-sm">
            <i className="ri-map-pin-2-fill text-2xl text-red-500 mt-1"></i>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">Destination</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{props.ride?.destinationText}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl shadow-sm">
            <i className="ri-currency-line text-2xl text-green-500 mt-1"></i>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">Cash</h3>
              <div className="text-sm text-gray-600">
                {coupon ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-500">₹{props.ride?.fare}</span>
                      <span className="text-green-600 font-bold text-base">₹{discountedFare}</span>
                    </div>
                    <span className="text-xs text-red-500 block bg-red-50 px-2 py-1 rounded-full">
                      Coupon: {coupon.code}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-base">₹{props.ride?.fare}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form and Buttons */}
        <div className="space-y-4">
          <form onSubmit={submitHander}>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 bg-gray-100 text-center text-lg font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
                  placeholder="-"
                />
              ))}
            </div>
            <button
              onClick={confirmRide}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Confirm Ride
            </button>
            <button
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </form>

          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <MessageCircleMore className="w-6 h-6" />
            Message User
          </button>
        </div>
      </div>

      <ChatComponent
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        setIsChatOpen={setIsChatOpen}
        Name={`${props.ride?.user?.fullname?.firstname || "Driver"} ${
          props.ride?.user?.fullname?.lastname || ""
        }`}
        Image={props.ride?.user?.profileImage || "default-profile.png"}
        rideId={props.ride?._id}
        recipientId={props.ride?.user?._id}
      />
    </div>
  );
};

export default ConfirmRidePopUp;