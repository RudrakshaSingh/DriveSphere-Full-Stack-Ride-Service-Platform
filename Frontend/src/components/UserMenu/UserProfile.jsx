/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Mail, Phone, Calendar, Edit2, Trash2, ChevronRight, Shield, Lock, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UserProfile() {
	const [user, setUser] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [couponToDelete, setCouponToDelete] = useState(null); // state for coupon delete modal
	const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false); // state for account delete modal
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); // state for edit profile modal
	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // state for change password modal
	const [profileFormData, setProfileFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		mobileNumber: "",
		profileImage: null
	});
	const [passwordFormData, setPasswordFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const itemsPerPage = 4;
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

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
					// Initialize form data with user data
					setProfileFormData({
						firstname: data.fullname.firstname,
						lastname: data.fullname.lastname,
						email: data.email,
						mobileNumber: data.mobileNumber,
						profileImage: null
					});
				}
			});
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	const handleEditProfile = () => {
		setIsEditProfileModalOpen(true);
	};

	const handleDeleteAccount = () => {
		setIsDeleteAccountModalOpen(true);
	};

	const confirmDeleteAccount = async () => {
		setIsDeleteAccountModalOpen(false);
		await toast
			.promise(
				axios.delete(`${import.meta.env.VITE_BASE_URL}/users/delete`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				{
					loading: "Deleting. Please wait...",
					success: "Account deleted successfully!",
					error: "Error during account deletion",
				}
			)
			.then((response) => {
				if (response.status === 200) {
					localStorage.removeItem("token");
					navigate("/");
				}
			});
	};

	const handleForgotPassword = () => {
		setIsChangePasswordModalOpen(true);
	};

	// Handle profile form input changes
	const handleProfileInputChange = (e) => {
		const { name, value } = e.target;
		setProfileFormData({
			...profileFormData,
			[name]: value
		});
	};

	// Handle profile image upload
	const handleProfileImageChange = (e) => {
		setProfileFormData({
			...profileFormData,
			profileImage: e.target.files[0]
		});
	};

	// Handle password form input changes
	const handlePasswordInputChange = (e) => {
		const { name, value } = e.target;
		setPasswordFormData({
			...passwordFormData,
			[name]: value
		});
	};

	// Submit profile update
	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		
		if (isSubmitting) return;
		setIsSubmitting(true);
		
		try {
			const formData = new FormData();
			formData.append("firstname", profileFormData.firstname);
			formData.append("lastname", profileFormData.lastname);
			formData.append("email", profileFormData.email);
			formData.append("mobileNumber", profileFormData.mobileNumber);
			
			if (profileFormData.profileImage) {
				formData.append("profileImage", profileFormData.profileImage);
			}
			
			const response = await toast.promise(
				axios.put(
					`${import.meta.env.VITE_BASE_URL}/users/update-profile`, 
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data"
						},
					}
				),
				{
					loading: "Updating profile...",
					success: "Profile updated successfully!",
					error: "Failed to update profile"
				}
			);
			
			if (response.status === 200) {
				setIsEditProfileModalOpen(false);
				fetchUserData(); // Refresh user data
			}
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Submit password change
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		
		if (isSubmitting) return;
		
		// Validate passwords match
		if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
			toast.error("New passwords don't match");
			return;
		}
		
		setIsSubmitting(true);
		
		try {
			const response = await toast.promise(
				axios.post(
					`${import.meta.env.VITE_BASE_URL}/users/change-password`,
					{
						currentPassword: passwordFormData.currentPassword,
						newPassword: passwordFormData.newPassword
					},
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				),
				{
					loading: "Changing password...",
					success: "Password changed successfully!",
					error: "Failed to change password"
				}
			);
			
			if (response.status === 200) {
				setIsChangePasswordModalOpen(false);
				setPasswordFormData({
					currentPassword: "",
					newPassword: "",
					confirmPassword: ""
				});
			}
		} catch (error) {
			console.error("Error changing password:", error);
		} finally {
			setIsSubmitting(false);
		}
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

	const couponColors = ["bg-yellow-50", "bg-green-50", "bg-red-50", "bg-purple-50", "bg-blue-50"];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="sticky top-0 bg-white shadow-sm z-10">
				<div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
					<button
						onClick={() => window.history.back()}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						aria-label="Go back">
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
									src={user?.profileImage || "http://res.cloudinary.com/divxsdt9u/image/upload/v1738732448/uber/hbebclcy8zjlhzb3ilak.jpg"}
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
							onClick={handleEditProfile}
							className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
							aria-label="Edit profile picture">
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
								className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group">
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
								className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 group">
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
								className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group">
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
												className={`relative flex flex-col items-center p-3 rounded-xl ${couponColor} transition-colors hover:bg-gray-100`}>
												{/* Delete Icon: shows if clicked and qualifies (expired or used) */}
												{(!coupon.isActive || new Date(coupon.expiryDate) < new Date()) && (
													<button
														onClick={(e) => {
															e.stopPropagation();
															setCouponToDelete(coupon._id);
														}}
														className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-200"
														aria-label="Delete coupon">
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
													}`}>
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
												onClick={() => handlePageChange(i + 1)}>
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

			{/* Delete Coupon Confirmation Modal */}
			{couponToDelete && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-lg font-bold mb-4">Are you sure you want to delete this coupon?</h3>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => {
									console.log("Deleting coupon:", couponToDelete);
									// Here you can call your delete logic, for example:
									// deleteCoupon(couponToDelete);
									setCouponToDelete(null);
								}}
								className="bg-red-600 text-white px-4 py-2 rounded">
								Yes
							</button>
							<button onClick={() => setCouponToDelete(null)} className="bg-gray-300 px-4 py-2 rounded">
								No
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Account Confirmation Modal */}
			{isDeleteAccountModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
						<h3 className="text-lg font-bold mb-4 text-center">
							Are you sure you want to delete your account?
						</h3>
						<p className="text-sm text-gray-600 mb-6 text-center">
							This action cannot be undone. All your data will be permanently removed.
						</p>
						<div className="flex justify-center space-x-4">
							<button
								onClick={confirmDeleteAccount}
								className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
								Yes, Delete
							</button>
							<button
								onClick={() => setIsDeleteAccountModalOpen(false)}
								className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Profile Modal */}
			{isEditProfileModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h3 className="text-lg font-bold mb-4">Edit Profile</h3>
						<form onSubmit={handleProfileSubmit}>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="w-1/2">
										<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
										<input
											type="text"
											name="firstname"
											value={profileFormData.firstname}
											onChange={handleProfileInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											required
										/>
									</div>
									<div className="w-1/2">
										<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
										<input
											type="text"
											name="lastname"
											value={profileFormData.lastname}
											onChange={handleProfileInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											required
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
									<input
										type="email"
										name="email"
										value={profileFormData.email}
										onChange={handleProfileInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
									<input
										type="tel"
										name="mobileNumber"
										value={profileFormData.mobileNumber}
										onChange={handleProfileInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
									<input
										type="file"
										name="profileImage"
										onChange={handleProfileImageChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										accept="image/*"
									/>
									<p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
								</div>
							</div>
							
							<div className="flex justify-end space-x-3 mt-6">
								<button
									type="button"
									onClick={() => setIsEditProfileModalOpen(false)}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300">
									{isSubmitting ? "Updating..." : "Update Profile"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Change Password Modal */}
			{isChangePasswordModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h3 className="text-lg font-bold mb-4">Change Password</h3>
						<form onSubmit={handlePasswordSubmit}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
									<input
										type="password"
										name="currentPassword"
										value={passwordFormData.currentPassword}
										onChange={handlePasswordInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
									<input
										type="password"
										name="newPassword"
										value={passwordFormData.newPassword}
										onChange={handlePasswordInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
										minLength="6"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
									<input
										type="password"
										name="confirmPassword"
										value={passwordFormData.confirmPassword}
										onChange={handlePasswordInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
										minLength="6"
									/>
									{passwordFormData.newPassword !== passwordFormData.confirmPassword && 
										passwordFormData.confirmPassword && (
										<p className="text-xs text-red-500 mt-1">Passwords don't match</p>
									)}
								</div>
							</div>
							
							<div className="flex justify-end space-x-3 mt-6">
								<button
									type="button"
									onClick={() => setIsChangePasswordModalOpen(false)}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting || (passwordFormData.newPassword !== passwordFormData.confirmPassword && passwordFormData.confirmPassword)}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300">
									{isSubmitting ? "Changing..." : "Change Password"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default UserProfile;