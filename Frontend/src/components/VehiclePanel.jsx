/* eslint-disable react/prop-types */
import { ChevronDown, Users, Clock, Sparkles } from "lucide-react";

const VehiclePanel = (props) => {
    return (
        <div className="px-3 pt-4">
            <button
                className="absolute top-2 left-1/2 -translate-x-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => props.setVehiclePanel(false)}
                aria-label="Close panel"
            >
                <ChevronDown size={28} className="text-gray-500" />
            </button>

            <h3 className="text-xl font-bold mb-3 text-gray-900">Select your ride</h3>

            <div className="space-y-2">
                {/* Car Option */}
                <button
                    onClick={() => {
                        props.setConfirmRidePanel(true);
                        props.setVehicleType("car");
                        props.setVehiclePanel(false);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 active:bg-gray-50 transition-all duration-200"
                >
                    <img
                        className="h-14 w-14 object-cover rounded-lg"
                        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                        alt="Car"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">Premium Sedan</h4>
                            <div className="flex items-center text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                                <Users size={10} className="mr-0.5" />
                                4
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center text-green-600 whitespace-nowrap">
                                <Clock size={12} className="mr-0.5" />
                                3 min
                            </span>
                            <span className="flex items-center text-gray-500 truncate">
                                <Sparkles size={12} className="mr-0.5 flex-shrink-0" />
                                Comfort ride
                            </span>
                        </div>
                    </div>
                    <div className="text-right pl-2">
                        <span className="text-base font-semibold text-gray-900 whitespace-nowrap">₹{props.fare.car}</span>
                    </div>
                </button>

                {/* Motorcycle Option */}
                <button
                    onClick={() => {
                        props.setConfirmRidePanel(true);
                        props.setVehicleType("moto");
                        props.setVehiclePanel(false);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 active:bg-gray-50 transition-all duration-200"
                >
                    <img
                        className="h-14 w-14 object-cover rounded-lg"
                        src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
                        alt="Motorcycle"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">Bike</h4>
                            <div className="flex items-center text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                                <Users size={10} className="mr-0.5" />
                                1
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center text-green-600 whitespace-nowrap">
                                <Clock size={12} className="mr-0.5" />
                                2 min
                            </span>
                            <span className="flex items-center text-gray-500 truncate">
                                <Sparkles size={12} className="mr-0.5 flex-shrink-0" />
                                Quick ride
                            </span>
                        </div>
                    </div>
                    <div className="text-right pl-2">
                        <span className="text-base font-semibold text-gray-900 whitespace-nowrap">₹{props.fare.moto}</span>
                    </div>
                </button>

                {/* Auto Option */}
                <button
                    onClick={() => {
                        props.setConfirmRidePanel(true);
                        props.setVehicleType("auto");
                        props.setVehiclePanel(false);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl hover:border-gray-300 active:bg-gray-50 transition-all duration-200"
                >
                    <img
                        className="h-14 w-14 object-cover rounded-lg"
                        src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
                        alt="Auto"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">Auto</h4>
                            <div className="flex items-center text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                                <Users size={10} className="mr-0.5" />
                                3
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center text-green-600 whitespace-nowrap">
                                <Clock size={12} className="mr-0.5" />
                                1 min
                            </span>
                            <span className="flex items-center text-gray-500 truncate">
                                <Sparkles size={12} className="mr-0.5 flex-shrink-0" />
                                Best value
                            </span>
                        </div>
                    </div>
                    <div className="text-right pl-2">
                        <span className="text-base font-semibold text-gray-900 whitespace-nowrap">₹{props.fare.auto}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default VehiclePanel;