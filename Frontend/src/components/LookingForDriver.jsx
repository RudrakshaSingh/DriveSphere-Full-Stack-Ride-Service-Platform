/* eslint-disable react/prop-types */
import { ChevronDown, MapPin, IndianRupee } from "lucide-react";
import car from "../assets/car.png";
import moto from "../assets/moto.png";
import auto from "../assets/auto.png";

const LookingForDriver = (props) => {
  let vehicleImg = "";
  if (props.vehicleType === "car") {
    vehicleImg = car;
  } else if (props.vehicleType === "moto") {
    vehicleImg = moto;
  } else if (props.vehicleType === "auto") {
    vehicleImg = auto;
  }

  return (
    <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto">
      <button
        className="absolute top-3 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors shadow-md"
        onClick={() => props.setVehicleFound(false)}
      >
        <ChevronDown size={28} className="text-gray-600" />
      </button>

      <h3 className="text-2xl font-semibold text-center mt-10 mb-6">
        Looking for a Driver
      </h3>

      <div className="relative h-32 mb-6 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800 to-gray-600">
        {/* Road markings */}
        <div className="absolute inset-0 w-full h-1/10 bg-gray-700">
          <div className="absolute bottom-1/2 w-full h-2 flex justify-between">
            <div className="w-1/4 h-full  bg-yellow-400 mx-2"></div>
            <div className="w-1/4 h-full  bg-yellow-400 mx-2"></div>
            <div className="w-1/4 h-full  bg-yellow-400 mx-2"></div>
            <div className="w-1/4 h-full  bg-yellow-400 mx-2"></div>
            <div className="w-1/4 h-full  bg-yellow-400 mx-2"></div>
          </div>
        </div>
        
        {/* Vehicle with animation */}
        <div className="absolute bottom-8 drive-animation">
          <img 
            src={vehicleImg} 
            alt="Vehicle" 
            className="h-16 object-contain"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Pickup</h3>
            <p className="text-sm text-gray-600">{props.pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Destination</h3>
            <p className="text-sm text-gray-600">{props.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <IndianRupee size={20} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
            Payment
              
            </h3>
            <p className="text-sm text-gray-600">₹{props.fare[props.vehicleType]} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
