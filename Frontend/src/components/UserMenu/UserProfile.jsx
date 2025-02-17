/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Mail, Phone, Calendar, Edit2, Trash2, ChevronRight, Shield, Lock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function UserProfile() {
  const [user, setUser] = useState(null);
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
        <div className=" rounded-2xl shadow-sm overflow-hidden bg-gray-50">
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
                  <p className="text-gray-900 font-medium truncate">{formatDate(user?.createdAt)}</p>
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
                <ChevronRight size={20} className="text-gray-400 transform group-hover:translate-x-1 transition-transform duration-200" />
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
                <ChevronRight size={20} className="text-gray-400 transform group-hover:translate-x-1 transition-transform duration-200" />
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
                <ChevronRight size={20} className="text-red-400 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
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
    </div>
  );
}

export default UserProfile;
