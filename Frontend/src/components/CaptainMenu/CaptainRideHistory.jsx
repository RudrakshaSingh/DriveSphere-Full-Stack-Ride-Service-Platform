/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { CaptainDataContext } from "../../context/CapatainContext";
import {
  Clock,
  MapPin,
  Car,
  Star,
  Calendar,
  Navigation,
  Receipt,
  IndianRupee,
  MapPin as MapPinHouse,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import UserHistoryMap from "../UserMenu/UserHistoryMap";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function CaptainRideHistory() {
  const { captain } = useContext(CaptainDataContext);
  const [expandedRide, setExpandedRide] = useState(null);
  const [rideHistoryData, setRideHistoryData] = useState(null);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 5;
  

  const fetchCaptainRideHistory = async () => {
    await toast
      .promise(
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/captain-ridehistory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Fetching ride data. Please wait...",
          success: "Fetching ride data successful!",
          error: "Error during fetching ride data",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.message;
          setRideHistoryData(data);
        }
      });
  };

  useEffect(() => {
    fetchCaptainRideHistory();
  }, [ ]);

  if (!rideHistoryData) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600 bg-white px-8 py-4 rounded-lg shadow-md">
          Loading ride history...
        </div>
      </div>
    );
  }

  const rides = rideHistoryData.map((ride) => ({
    id: ride._id,
    userId: ride.user._id,
    fname: ride?.user?.fullname?.firstname,
    lname: ride?.user?.fullname?.lastname,
    vehicleType: ride?.captain?.vehicle?.vehicleType,
    vehiclePlate: ride?.captain?.vehicle?.plate,
    vehicleModel: ride?.captain?.vehicle?.model,
    vehicleColor: ride?.captain?.vehicle?.color,
    userImage: ride?.user?.profileImage,
    date: new Date(ride?.createdAt).toLocaleDateString(),
    time: new Date(ride?.createdAt).toLocaleTimeString(),
    from: ride?.originText,
    to: ride?.destinationText,
    fare: ride?.fare,
    duration: ride?.duration,
    distance: ride?.distance,
    rating: ride?.feedback?.overallExperience ?? 0,
    payment: ride?.paymentID ? `•••• ${ride.paymentID}` : "XXXX",
    pickup: ride?.origin,
    drop: ride?.destination,
    invoiceLink: "#",
  }));

  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = rides.slice(indexOfFirstRide, indexOfLastRide);
  const totalPages = Math.ceil(rides.length / ridesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Captain-specific stats
  const stats = [
    {
      icon: IndianRupee,
      value: `₹${captain?.TotalEarnings || 0}`,
      label: "Total Earnings",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      icon: Car,
      value: `${captain?.RideDone || 0}`,
      label: "Rides Completed",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      valueColor: "text-indigo-700",
    },
    {
      icon: Navigation,
      value: `${captain?.distanceTravelled?.toFixed(2) || 0} Km`,
      label: "Distance Travelled",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
    {
      icon: Clock,
      value: `${(captain?.minutesWorked / 60).toFixed(2) || 0} Hrs`,
      label: "Time Worked",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-30 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-10">
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 p-2.5 top-4 hover:bg-white/10 rounded-full transition-colors "
          aria-label="Go back">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mt-5">
            <h1 className="text-3xl font-bold text-white">Your Completed Rides</h1>
            <p className="text-blue-100 text-sm max-w-md">
              Track your driving history and earnings in one place
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Captain Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-4 rounded-xl shadow-md border border-white/50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg bg-white/90 backdrop-blur-sm ${stat.iconColor} shadow-sm`}>
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

        {/* Ride List (Same structure as user history but with captain perspective) */}
        <div className="space-y-4">
          {currentRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-white/50">
              {/* Ride Summary */}
              <div
                className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{ride.date}</span>
                      <span>•</span>
                      <span>{ride.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <MapPinHouse className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium truncate max-w-[200px] text-emerald-700">
                            {ride.from}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium truncate max-w-[200px] text-red-700">
                            {ride.to}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{ride.fare}
                    </div>
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
                <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
                  <div className="text-xs text-gray-500">Ride ID: {ride.id}</div>

                  {/* Route Map */}
                  <div className="relative rounded-lg overflow-hidden shadow-md">
                    <div className="w-full h-40 object-cover">
                      <UserHistoryMap pickup={ride.pickup} drop={ride.drop} />
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
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

                  {/* Rider Details */}
                  <div className="bg-white p-4 rounded-lg space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={ride.userImage}
                          alt="Rider"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <div className="text-xs text-gray-500">Passenger</div>
                          <div className="font-medium text-gray-900">
                            {ride.fname} {ride.lname}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Rating */}
                  <div className="flex justify-between bg-white p-4 rounded-lg shadow-sm">
                    <div>
                      <div className="text-xs text-gray-500">PAYMENT</div>
                      <div className="font-medium text-gray-900">{ride.payment}</div>
                    </div>
                    {ride.rating > 0 ? (
                      <div>
                        <div className="text-xs text-gray-500">RIDER RATING</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(ride.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No rating given</div>
                    )}
                  </div>

                  {/* Actions */}
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                    <Receipt className="w-5 h-5" />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {rides.length > ridesPerPage && (
          <div className="flex justify-center items-center space-x-2 py-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                } transition-colors`}
                onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-gray-200/50 pt-6 pb-4">
          <p className="text-xs text-gray-500 mb-2">© 2025 DriveSphere Captains. All rights reserved.</p>
          <div className="flex justify-center items-center space-x-4 text-xs">
            <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptainRideHistory;