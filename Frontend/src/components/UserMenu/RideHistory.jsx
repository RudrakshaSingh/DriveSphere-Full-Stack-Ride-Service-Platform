/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Clock, MapPin, Car, Star, Calendar, Navigation, Receipt, IndianRupee, ArrowDownUp, MapPin as MapPinHouse, Phone, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserDataContext } from '../../context/UserContext';

const RideHistory = () => {
  const [expandedRide, setExpandedRide] = useState(null);
  const [rideHistoryData, setRideHistoryData] = useState(null);
  const { user } = useContext(UserDataContext);
  const token = localStorage.getItem("token");

  const fetchUserDataRideHistory = async () => {
    await toast.promise(
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/ridehistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      {
        loading: "Fetching ride data. Please wait...",
        success: "Fetching ride data successful!",
        error: "Error during fetching ride userdata",
      }
    ).then((response) => {
      if (response.status === 200) {
        const data = response.data.message;
        setRideHistoryData(data);
      }
    });
  }

  useEffect(() => {
    fetchUserDataRideHistory();
  }, []);

  if (!rideHistoryData) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading ride history...</div>
      </div>
    );
  }

  const rides = rideHistoryData.map(ride => ({
    id: ride._id,
    fname: ride?.captain?.fullname?.firstname,
    lname: ride?.captain?.fullname?.lastname,
    mobile: ride?.captain?.mobileNumber,
    vehicleType: ride?.captain?.vehicle?.vehicleType,
    vehiclePlate: ride?.captain?.vehicle?.plate,
    vehicleModel: ride?.captain?.vehicle?.model,
    vehicleColor: ride?.captain?.vehicle?.color,
    captainImage: ride.captainProfilePicture,
    date: new Date(ride?.createdAt).toLocaleDateString(),
    time: new Date(ride?.createdAt).toLocaleTimeString(),
    from: ride?.originText,
    to: ride?.destinationText,
    fare: ride?.fare,
    duration: ride?.duration,
    distance: ride?.distance,
    rating: ride.rating ?? "5",
    payment: ride?.paymentID ? `•••• ${ride.paymentID}` : "XXXX",
    routeImage: 'https://blogadmin.uberinternal.com/wp-content/uploads/2022/08/image22.gif',
    invoiceLink: '#'
  }));

  const stats = [
    {
      icon: Car,
      value: `${user?.ridesCompleted || 0}`,
      label: 'Total Rides',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-700'
    },
    {
      icon: IndianRupee,
      value: `${user?.totalMoneySpend || 0}`,
      label: 'Total Spent',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700'
    },
    {
      icon: ArrowDownUp,
      value: `${user?.totalDistance || 0} Km`,
      label: 'Distance',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      valueColor: 'text-violet-700'
    },
    {
      icon: Clock,
      value: `${(user?.totalTime)/60 || 0} Hrs`,
      label: 'Time',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-30 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Your Rides</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.bgColor} p-4 rounded-xl shadow-sm border border-opacity-10 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg bg-white/80 backdrop-blur-sm ${stat.iconColor}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-lg font-bold ${stat.valueColor}`}>{stat.value}</div>
                  <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ride List */}
        <div className="space-y-3">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Ride Summary */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{ride.date}</span>
                      <span>•</span>
                      <span>{ride.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <MapPinHouse className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium truncate max-w-[200px]">{ride.from}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium truncate max-w-[200px]">{ride.to}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-lg font-bold text-gray-900">₹{ride.fare}</div>
                    {expandedRide === ride.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRide === ride.id && (
                <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
                  <div className="text-xs text-gray-500">Ride ID: {ride.id}</div>

                  {/* Route Map */}
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={ride.routeImage}
                      alt="Route map"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">{ride.distance} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{ride.duration} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details */}
                  <div className="bg-white p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={ride.captainImage}
                          alt="Driver"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <div className="text-xs text-gray-500">YOUR DRIVER</div>
                          <div className="font-medium text-gray-900">{ride.fname} {ride.lname}</div>
                        </div>
                      </div>
                      <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">VEHICLE</div>
                        <div className="font-medium text-gray-900">{ride.vehicleColor} {ride.vehicleModel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">PLATE</div>
                        <div className="font-medium text-gray-900">{ride.vehiclePlate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Rating */}
                  <div className="flex justify-between bg-white p-4 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500">PAYMENT</div>
                      <div className="font-medium text-gray-900">{ride.payment}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">YOUR RATING</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(ride.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <Receipt className="w-5 h-5" />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="text-sm text-gray-500">
            {rides.length} rides shown • Updated just now
          </div>
          <p className="text-xs text-gray-500">
            By using our service, you agree to our{' '}
            <Link to='/Drivo-Rides-Terms-and-Conditions' className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to='/Drivo-Rides-privacy-policy' className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;