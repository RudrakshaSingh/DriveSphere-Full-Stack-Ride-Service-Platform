/* eslint-disable react/prop-types */
import { User, History, HeadphonesIcon, LogOut, Share2, X, Info, Gift } from "lucide-react";
import logo from "../../assets/logo.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserMenuPanel = ({ openMenu, toggleMenu }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
	try {
	  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
		headers: {
		  Authorization: `Bearer ${localStorage.getItem("token")}`,
		}, // Send cookies with the request
	  });

	  if (response.status === 200) {

		// Clear local storage or user state if used
		localStorage.removeItem("token");
		toast.success("Logout successful");

		// Redirect to login or home page
		navigate("/");
	  }
	} catch (error) {
	  console.error("Error during logout:", error);
	  toast.error("Logout failed");
	}
  };

  const menuItems = [
	{
	  icon: <History size={20} color="#EF4444" />, // Red
	  label: "Ride History",
	  action: () => {
		navigate("/user-rideHistory");
		toggleMenu();
	  },
	  bgColor: "bg-red-100",
	},
	{
	  icon: <Info size={20} color="#3B82F6" />, // Blue
	  label: "About",
	  action: () => {
		navigate("/aboutus");
		toggleMenu();
	  },
	  bgColor: "bg-blue-100",
	},
	{
	  icon: <HeadphonesIcon size={20} color="#10B981" />, // Green
	  label: "Support",
	  action: () => {
		navigate("/support");
		toggleMenu();
	  },
	  bgColor: "bg-green-100",
	},
	{
		icon: <Gift size={20} color="#EC4899" />, // Pink color
		label: "Try your Luck",
		action: () => {
		  navigate("/user-scratch-card");
		  toggleMenu();
		},
		bgColor: "bg-pink-100",
	  },
	{
	  icon: <Share2 size={20} color="#A855F7" />, // Purple
	  label: "Refer & Earn",
	  action: () => console.log("Refer clicked"),
	  bgColor: "bg-purple-100",
	},
	{
	  icon: <LogOut size={20} color="#F59E0B" />, // Yellow
	  label: "Logout",
	  action: () => {
		toggleMenu();
		handleLogout();
	  },
	  bgColor: "bg-yellow-100",
	},
  ];

  return (
	<>
	  {/* Overlay with fade effect */}
	  {openMenu && (
		<div
		  className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40"
		  onClick={toggleMenu}
		/>
	  )}

	  {/* Panel */}
	  <div
		className={`
	  fixed top-0 left-0 h-full w-2/3 sm:w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
	  ${openMenu ? "translate-x-0" : "-translate-x-full"}
	`}>
		{/* Header with logo */}
		<div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
		  <div className="flex items-center justify-between mb-4">
			<img src={logo} alt="Logo" className="h-12 w-auto" />
			<button onClick={toggleMenu} className="p-2 hover:bg-white/10 rounded-full transition-colors">
			  <X size={24} className="text-white" />
			</button>
		  </div>

		  {/* Profile Button */}
		  <button
			onClick={() => {
			  toggleMenu();
			  navigate("/user-profile");
			}}
			className=" w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-left flex items-center space-x-3">
			<div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
			  <User size={20} className="text-white" />
			</div>
			<span className="font-medium">View Profile</span>
		  </button>
		</div>

		{/* Menu Items with enhanced styling */}
		<div className="py-2">
		  {menuItems.map((item, index) => (
			<button
			  key={index}
			  onClick={item.action}
			  className="w-full px-6 py-4 flex items-center space-x-4 transition-colors group hover:bg-gray-50">
			  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bgColor}`}>
				<span className="transition-colors">{item.icon}</span>
			  </div>
			  <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
				{item.label}
			  </span>
			</button>
		  ))}
		</div>

	  </div>
	</>
  );
};

export default UserMenuPanel;