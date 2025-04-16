/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";

const RidePopUp = (props) => {

  // Extracting coupon response safely
  const coupon = props.ride?.couponResponse;
  const discountAmount = coupon?.type === "percentage" 
    ? (props.ride?.fare * coupon.discount) / 100 
    : coupon?.discount;
  const discountedFare = discountAmount ? Math.max(props.ride?.fare - discountAmount, 0) : props.ride?.fare;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full  bg-white rounded-t-2xl shadow-2xl overflow-y-auto z-50">
      <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center border-b border-gray-200">
        <button
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => props.setRidePopupPanel(false)}
        >
          <ChevronDown size={28} strokeWidth={2.5} className="text-gray-600" />
        </button>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xl font-bold text-gray-800 mt-3 mb-4 text-center">
          New Ride Available!
        </h3>

        {/* User Details */}
        <div className="bg-amber-50 p-3 rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-200"
              src={props.ride?.user.profileImage || "default-profile.png"}
              alt="User profile"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}
            </h2>
          </div>
          <span className="text-lg font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
            2.2 KM
          </span>
        </div>

        {/* Ride Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
            <i className="ri-map-pin-user-fill text-xl text-blue-500 mt-1"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Pickup</h3>
              <p className="text-sm text-gray-600">{props.ride?.originText}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
            <i className="ri-map-pin-2-fill text-xl text-red-500 mt-1"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Destination</h3>
              <p className="text-sm text-gray-600">{props.ride?.destinationText}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
            <i className="ri-currency-line text-xl text-green-500 mt-1"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Cash</h3>
              <div className="text-sm text-gray-600">
                {coupon ? (
                  <div className="space-y-1">
                    <div>
                      <span className="line-through text-gray-500">₹{props.ride?.fare}</span>
                      <span className="text-green-600 font-bold ml-2">₹{discountedFare}</span>
                    </div>
                    <span className="text-xs text-red-500 block">Coupon: {coupon.code}</span>
                  </div>
                ) : (
                  <span className="font-bold">₹{props.ride?.fare}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-md transition-colors text-base"
          >
            Accept Ride
          </button>

          <button
            onClick={() => props.setRidePopupPanel(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 rounded-md transition-colors text-base"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;