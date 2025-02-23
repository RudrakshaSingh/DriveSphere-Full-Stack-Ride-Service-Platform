/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import {
  Mail,
  Phone,
  Calendar,
  Edit2,
  Trash2,
  ChevronRight,
  Shield,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponToDelete, setCouponToDelete] = useState(null); // state for delete modal
  const itemsPerPage = 4;
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const fetchUserData = async () => {
    await toast
      .promise(
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          loading: "Fetching data. Please wait...",
          success: "Fetching data successful!",
          error: "Error during fetching userdata",
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.message;
          setUser(data);
        }
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  // Filter all coupons
  const allCoupons = user?.coupons || [];

  // Calculate the indices for pagination
  const indexOfLastCoupon = currentPage * itemsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - itemsPerPage;
  const currentCoupons = allCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  const totalPages = Math.ceil(allCoupons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateExpiresIn = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff < 0) {
      return "Expired";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const parts = [];
    if (days > 0) parts.push(`${days} days`);
    if (hours > 0) parts.push(`${hours} hours`);
    if (minutes > 0) parts.push(`${minutes} min`);

    return parts.length > 0 ? `Expires in ${parts.join(" ")}` : "Expired";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const couponColors = [
    "bg-yellow-50",
    "bg-green-50",
    "bg-red-50",
    "bg-purple-50",
    "bg-blue-50",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Profile Details</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Profile Card */}
        <div className="rounded-2xl shadow-sm overflow-hidden bg-gray-50">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Background"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
          </div>
          <div className="relative px-4 pb-6">
            <div className="absolute -top-12 left-0 right-0 flex justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="http://res.cloudinary.com/divxsdt9u/image/upload/v1738732448/uber/hbebclcy8zjlhzb3ilak.jpg"
                  alt="Profile"
                />
              </div>
            </div>
            <div className="pt-16 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {`${user?.fullname.firstname} ${user?.fullname.lastname}`}
              </h1>
              <div className="inline-flex items-center justify-center mt-2 px-3 py-1 rounded-full bg-gray-100">
                <Shield size={14} className="text-gray-500 mr-1.5" />
                <span className="text-sm font-medium text-gray-700">Verified Account</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <button
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Edit profile picture"
            >
              <Edit2 size={16} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div className="flex bg-blue-50 items-center space-x-4 p-3 rounded-xl transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-xl">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                </div>
              </div>

              <div className="flex bg-purple-50 items-center space-x-4 p-3 rounded-xl transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0 p-3 bg-purple-50 rounded-xl">
                  <Phone size={20} className="text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900 font-medium truncate">{user?.mobileNumber}</p>
                </div>
              </div>

              <div className="flex bg-green-50 items-center space-x-4 p-3 rounded-xl transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0 p-3 bg-green-50 rounded-xl">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium truncate">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-3">
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Edit2 size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Edit Profile</span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 transform group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Lock size={20} className="text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Change Password</span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 transform group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={20} className="text-red-600" />
                  </div>
                  <span className="font-medium text-red-600">Delete Account</span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-red-400 transform group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Coupons Section with Grid Layout and Pagination */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Coupons: {user?.coupons?.length || 0}
            </h2>
            {user?.coupons && user.coupons.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {currentCoupons.map((coupon, index) => {
                    const couponColor = couponColors[index % couponColors.length];
                    return (
                      <div
                        key={coupon._id}
                        className={`relative flex flex-col items-center p-3 rounded-xl ${couponColor} transition-colors hover:bg-gray-100`}
                      >
                        {/* Delete Icon: shows if clicked and qualifies (expired or used) */}
                        {(!coupon.isActive ||
                          new Date(coupon.expiryDate) < new Date()) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCouponToDelete(coupon._id);
                            }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-200"
                            aria-label="Delete coupon"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        )}
                        <div className="p-3 bg-white rounded-xl">
                          <span className={`text-xl font-bold text-gray-600 ${couponColor}`}>
                            {coupon.code}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-500">
                          Discount: {coupon.discount}
                          {coupon.type === "fixed" ? " Rs off" : "% off"}
                        </p>
                        <div
                          className={`mt-1 text-xs px-2 py-1 rounded-full ${
                            coupon.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {coupon.isActive ? "Unused" : "Used"}
                        </div>
                        <p className="text-sm text-black mt-1 rounded-md p-2">
                          {calculateExpiresIn(coupon.expiryDate)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Pagination */}
                {user.coupons.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2 py-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`px-4 py-2 rounded-full ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
                        } transition-colors`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No coupons available.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-6 pb-8">
          <p className="text-xs text-gray-500 mb-2">© 2025 DriveSphere Rides. All rights reserved.</p>
          <div className="flex justify-center items-center space-x-4 text-xs">
            <a href="#" className="text-blue-500 hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-blue-500 hover:text-gray-700 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {couponToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete this coupon?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  console.log("Deleting coupon:", couponToDelete);
                  // Here you can call your delete logic, for example:
                  // deleteCoupon(couponToDelete);
                  setCouponToDelete(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setCouponToDelete(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
