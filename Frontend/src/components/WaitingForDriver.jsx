/* eslint-disable react/prop-types */
import { ChevronDown, MessageCircleMore, MapPin, IndianRupee } from "lucide-react";
import ChatComponent from "./Chat/ChatComponent";
import { useState } from "react";

const WaitingForDriver = (props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto">
      <button
        className="absolute top-3 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}>
        <ChevronDown size={28} className="text-gray-600" />
      </button>

      <h3 className="text-2xl font-semibold text-center mt-10 mb-6">Waiting for Driver</h3>

      <div className="flex items-center gap-4 mb-6">
        <img
          className="h-20 w-20 rounded-full object-cover "
          src={props.ride?.captain.profileImage || "default-profile.png"}
          alt="Driver"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {props.ride?.captain.fullname.firstname + " " + props.ride?.captain.fullname.lastname}
          </h2>
          <h4 className="text-lg font-medium text-gray-600">{props.ride?.captain.vehicle.model}</h4>
          <p className="text-sm text-gray-500">{props.ride?.captain.vehicle.plate}</p>
          <h1 className="text-sm font-semibold mt-2">OTP: {props.ride?.otp}</h1>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Pickup</h3>
            <p className="text-sm text-gray-600">{props.ride?.originText}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Destination</h3>
            <p className="text-sm text-gray-600">{props.ride?.destinationText}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <IndianRupee size={20} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment</h3>
            {props.couponResponse !== "" ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 line-through">
                  ₹{props.ride?.fare}
                </p>
                <p className="text-sm font-bold text-green-600">
                  ₹{Math.max(
                    props.ride?.fare -
                      (props.couponResponse.type === "fixed"
                        ? props.couponResponse.discount
                        : (props.ride?.fare * props.couponResponse.discount) / 100),
                    0
                  )}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                ₹{props.ride?.fare}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        onClick={() => setIsChatOpen(true)}>
        <MessageCircleMore className="w-5 h-5" />
        Message Driver
      </button>

      <ChatComponent
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
		setIsChatOpen = {setIsChatOpen}
        Name={`${props.ride?.captain?.fullname?.firstname || "Driver"} ${props.ride?.captain?.fullname?.lastname || ""}`}
        Image={props.ride?.captain?.profileImage || "default-profile.png"}
        rideId={props.ride?._id}
        recipientId={props.ride?.captain._id}
      />
    </div>
  );
};

export default WaitingForDriver;
