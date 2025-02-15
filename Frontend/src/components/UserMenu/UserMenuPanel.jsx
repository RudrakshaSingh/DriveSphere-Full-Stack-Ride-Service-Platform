/* eslint-disable react/prop-types */

import { User, History, HeadphonesIcon, LogOut, Share2, X, Info } from "lucide-react";
import logo from "../../assets/logo.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserMenuPanel = ({ openMenu, toggleMenu }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Send cookies with the request
			});

			if (response.status === 200) {
				console.log(response.data.message); // "Logout successful"

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
			icon: <History size={20} />,
			label: "Ride History",
			action: () => {
				navigate("/user-rideHistory");
				toggleMenu();
			},
		},
		// { icon: <MapPin size={20} />, label: 'Saved Places', action: () => console.log('Places clicked') },
		{ icon: <Info size={20} />, label: "About", action: () => console.log("About clicked") },
		{ icon: <HeadphonesIcon size={20} />, label: "Support", action: () => console.log("Support clicked") },
		{ icon: <Share2 size={20} />, label: "Refer & Earn", action: () => console.log("Refer clicked") },
		{
			icon: <LogOut size={20} />,
			label: "Logout",
			action: () => {
				console.log("Logout clicked");
				toggleMenu();
				handleLogout();
			},
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
        fixed left-0 top-0 w-full  bg-white shadow-2xl
        transform transition-all duration-300 ease-out z-50
        ${openMenu ? "translate-y-0" : "-translate-y-full"}
      `}>
				{/* Header with logo */}
				<div className="bg-gradient-to-r from-gray-500 to-gray-400 p-6">
					<div className="flex items-center justify-between mb-4">
						<img src={logo} alt="Logo" className="h-8 w-auto" />
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
						<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
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
							<span className="text-gray-400 group-hover:text-indigo-600 transition-colors">
								{item.icon}
							</span>
							<span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
								{item.label}
							</span>
						</button>
					))}
				</div>

				{/* Bottom decoration */}
				<div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-400" />
			</div>
		</>
	);
};

export default UserMenuPanel;
