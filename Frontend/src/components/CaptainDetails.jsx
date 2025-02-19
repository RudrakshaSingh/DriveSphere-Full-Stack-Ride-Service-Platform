import  { useContext } from 'react';
import { Clock, Gauge, Route } from 'lucide-react';
import { CaptainDataContext } from '../context/CapatainContext';

function CaptainDetails() {
    const { captain } = useContext(CaptainDataContext);
    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    if (!captain) {
        return (
            <div className="h-2/5 p-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600">Loading Captain Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-3/6 px-4 bg-white shadow-lg rounded-t-3xl">
            {/* Captain Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            className="h-14 w-14 rounded-full object-cover border-2 border-blue-500"
                            src={captain?.profileImage}
                            alt="Captain"
                        />
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                    <div className='mb-2'>
                        <h4 className="text-xl font-semibold">
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {capitalizeFirstLetter(captain?.vehicle?.vehicleType)} Driver
                        </p>
                    </div>
                </div>
                <div className="text-center bg-green-50 px-4 py-2 rounded-lg">
                    <h4 className="text-lg font-bold text-green-700">₹ {captain?.TotalEarnings}</h4>
                    <p className="text-xs text-green-600">Today&apos;s Earning</p>
                </div>
            </div>

            {/* Captain Stats */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                <div className="flex items-center justify-center gap-6 px-7">
                    {/* Hours Online */}
                    <div className="flex-1 text-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Clock className="w-6 h-6 text-red-600 mb-2 mx-auto" />
                        <h4 className="text-lg font-bold">{((captain?.minutesWorked)/60).toFixed(2)}</h4>
                        <p className="text-sm text-gray-600">Hours Online</p>
                    </div>

                    {/* Distance Covered */}
                    <div className="flex-1 text-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Gauge className="w-6 h-6 text-green-600 mb-2 mx-auto" />
                        <h4 className="text-lg font-bold">{captain?.distanceTravelled}</h4>
                        <p className="text-sm text-gray-600">KM Covered</p>
                    </div>

                    {/* Rides Completed */}
                    <div className="flex-1 text-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <Route className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                        <h4 className="text-lg font-bold">{captain?.RideDone}</h4>
                        <p className="text-sm text-gray-600">Rides Done</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaptainDetails;