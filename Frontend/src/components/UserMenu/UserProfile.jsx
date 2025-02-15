
import axios from 'axios';
import {  
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Shield,
  Lock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const fetchUserData = async () => {
    await toast
    .promise(
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      {
        loading: "Fetching data.Please wait...",
        success: "Fetching data successful!",
        error: "Error during fetching userdata",
      }
    )
    .then((response) => {
      if (response.status === 200) {
        // console.log(response.data.message);
        
        const data = response.data.message;
        setUser(data);
      }
    });
  }

  useEffect(() => {
    // This code runs once when the component mounts
    fetchUserData();
  }, []); // Empty dependency array means this effect runs once

  const handleEditProfile = () => {
    // Implement edit profile logic
    console.log('Edit profile clicked');
  };

  const handleDeleteAccount = () => {
    // Implement delete account logic
    console.log('Delete account clicked');
  };
  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 sm:p-10">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 flex items-center justify-center">
                  
                  <img className="w-full h-full object-cover rounded-full" src="http://res.cloudinary.com/divxsdt9u/image/upload/v1738732448/uber/hbebclcy8zjlhzb3ilak.jpg" alt="" />
                </div>
                {/* <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={16} className="text-indigo-600" />
                </button> */}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {`${user?.fullname.firstname} ${user?.fullname.lastname}`}
                </h1>
                <div className="flex items-center mt-2 text-white/80">
                  <Shield size={16} className="mr-2" />
                  <span>Verified Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          <div className="px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Mail size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Phone size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{user?.mobileNumber}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calendar size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">{formatDate(`${user?.createdAt}`)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="px-6 py-5 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            
            <button 
              onClick={handleEditProfile}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Edit2 size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">Edit Profile</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button 
  onClick={handleForgotPassword}
  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
>
  <div className="flex items-center space-x-3">
    <Lock size={20} className="text-gray-600" />
    <span className="font-medium text-gray-700">Forgot Password</span>
  </div>
  <ChevronRight size={20} className="text-gray-400" />
</button>

            <button 
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trash2 size={20} className="text-red-600" />
                <span className="font-medium text-red-700">Delete Account</span>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
					This site is protected by reCAPTCHA and the{" "}
					<a href="#" className="text-blue-600 hover:text-blue-700">
						Google Privacy Policy
					</a>{" "}
					and{" "}
					<a href="#" className="text-blue-600 hover:text-blue-700">
						Terms of Service
					</a>{" "}
					apply.
				</footer>
        
      </div>
    </div>
  );
}

export default UserProfile;