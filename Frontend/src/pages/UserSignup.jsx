import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Webcam from "react-webcam";
import { FilePlus, Camera, RefreshCw, Eye, EyeOff, User } from "lucide-react";
import { toast } from "react-hot-toast";

function UserSignup() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	// User and image states
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [previewURL, setPreviewURL] = useState(null);
	const [mobileNumber, setMobileNumber] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmShowPassword, setConfirmShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");

	// Webcam-related states
	const [showCamera, setShowCamera] = useState(false);
	const [facingMode, setFacingMode] = useState("user"); //"user" typically refers to the front-facing camera (for selfies), while "environment" refers to the rear camera.

	const navigate = useNavigate();
	const { setUser } = useContext(UserDataContext);
	const webcamRef = useRef(null);

	// File input ref to trigger file selection
	const fileInputRef = useRef(null);

	// Handle file selection from disk
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("File size should be less than 5MB");
				return;
			}
			setProfileImage(file);
			setPreviewURL(URL.createObjectURL(file));
		}
	};

	// Trigger file selection when FilePlus icon is clicked
	const openFileSelect = () => {
		fileInputRef.current.click();
	};

	//When the user clicks the camera icon (the Camera icon imported from lucide-react), the function openCameraPanel is called:
	const openCameraPanel = () => {
		setShowCamera(true);
	};

	// Capture photo from the webcam, convert the Base64 image to a Blob (and File)
	const capturePhoto = async () => {
		const imageSrc = webcamRef.current.getScreenshot();
		if (imageSrc) {
			// Convert the Base64 image to a Blob
			const blob = await fetch(imageSrc).then((res) => res.blob());
			// Create a File from the Blob
			const file = new File([blob], "captured-image.jpg", { type: blob.type });
			setProfileImage(file);
			setPreviewURL(imageSrc); //The file is saved in the state using setProfileImage(file) and the preview is updated with setPreviewURL(imageSrc).
		}
		setShowCamera(false);
	};

	// Toggle between front and rear camera
	const toggleFacingMode = () => {
		setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
	};

	// Remove the currently selected/captured image
	const removeImage = () => {
		setProfileImage(null);
		setPreviewURL(null);
	};

	const validateName = (name) => {
		const nameRegex = /^[A-Za-z\s'-]{3,50}$/;
		return nameRegex.test(name);
	};

	const validatePassword = (password) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
		return passwordRegex.test(password);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateMobile = (mobile) => {
		const mobileRegex = /^\d{10}$/;
		return mobileRegex.test(mobile);
	};

	// Handle form submission
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			// Password match validation
			if (password !== confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}

			// First name validation
			if (!validateName(firstName)) {
				toast.error(
					"First name must be 3-50 characters and contain only letters, spaces, apostrophes, or hyphens"
				);
				return;
			}

			// Last name validation
			if (!validateName(lastName)) {
				toast.error(
					"Last name must be 3-50 characters and contain only letters, spaces, apostrophes, or hyphens"
				);
				return;
			}

			// Email validation
			if (!validateEmail(email)) {
				toast.error("Please enter a valid email address");
				return;
			}

			// Password complexity validation
			if (!validatePassword(password)) {
				toast.error(
					"Password must be 6-20 characters with at least one uppercase, one lowercase, one number, and one special character"
				);
				return;
			}

			// Mobile number validation
			if (!validateMobile(mobileNumber)) {
				toast.error("Mobile number must be exactly 10 digits");
				return;
			}

			const formData = new FormData();
			formData.append("email", email);
			formData.append("password", password);
			formData.append("firstname", firstName);
			formData.append("lastname", lastName);
			formData.append("mobileNumber", mobileNumber);
			if (profileImage) formData.append("profileImage", profileImage);

			await toast
				.promise(
					axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, formData, {
						headers: { "Content-Type": "multipart/form-data" },
					}),
					{
						loading: "Signing up...",
						success: "Signup successful! Redirecting...",
						error: "Error during signup",
					}
				)
				.then((response) => {
					if (response.status === 201) {
						const data = response.data;
						setUser(data.message.user);

						localStorage.setItem("token", data.message.token);

						// Reset form states
						setEmail("");
						setPassword("");
						setFirstName("");
						setMobileNumber("");
						setLastName("");
						setProfileImage(null);
						setPreviewURL(null);

						navigate("/login");
					}
				});
		} catch (error) {
			// Handle error toast separately
			console.error("Error in signup page:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
				<div className="flex flex-col items-center justify-center mb-8">
					<User className="w-20 h-20 text-blue-500" />
					<h1 className="text-3xl font-bold text-gray-900">User SingUp</h1>
					<p className="text-gray-600 mt-2">Welcome To DriveSphere </p>
				</div>

				<form onSubmit={submitHandler} className="space-y-6 mb-6">
					{/* Profile Image Section */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">Profile Image</label>
						<div className="flex flex-col items-center space-y-3">
							{previewURL ? (
								<div className="relative group">
									<img
										src={previewURL}
										alt="Preview"
										className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg hover:border-blue-100 transition-all duration-200"
									/>
									<button
										type="button"
										onClick={removeImage}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm">
										×
									</button>
								</div>
							) : (
								<div className="flex space-x-4">
									<button
										type="button"
										onClick={openFileSelect}
										className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
										<FilePlus className="w-8 h-8 text-blue-500" />
									</button>
									<button
										type="button"
										onClick={openCameraPanel}
										className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
										<Camera className="w-8 h-8 text-blue-500" />
									</button>
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>
					</div>

					{/* Name Inputs */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
							<input
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								type="text"
								placeholder="John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
							<input
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								type="text"
								placeholder="Doe"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					</div>

					{/* Email Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							type="email"
							placeholder="john.doe@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					{/* Mobile Number Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
						<input
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							type="text"
							placeholder="9234567890"
							value={mobileNumber}
							onChange={(e) => setMobileNumber(e.target.value)}
						/>
					</div>

					{/* Password Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<div className="relative">
							<input
								required
								className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none">
								{showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Confirm Password Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
						<div className="relative">
							<input
								required
								className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								type={confirmShowPassword ? "text" : "password"}
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<button
								type="button"
								onClick={() => setConfirmShowPassword(!confirmShowPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none">
								{confirmShowPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
						Create Account
					</button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
							Login here
						</Link>
					</p>
				</form>

				{/* Footer */}
				<div className="text-center border-t border-gray-200 pt-6 pb-4">
					<p className="text-xs text-gray-500 mb-2">© 2025 DriveSphere Rides. All rights reserved.</p>
					<div className="flex justify-center items-center space-x-4 text-xs">
						<Link to="/privacy-policy" className="text-blue-500 hover:text-gray-700 transition-colors">
							Privacy Policy
						</Link>
						<span className="text-gray-300">•</span>
						<Link to="/terms-of-service" className="text-blue-500 hover:text-gray-700 transition-colors">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>

			{/* Webcam Modal */}
			{showCamera && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
						<div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
							<Webcam
								audio={false}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								videoConstraints={{
									width: 1280,
									height: 720,
									facingMode: facingMode,
								}}
								className="w-full h-full object-cover"
							/>
							<button
								onClick={toggleFacingMode}
								className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
								<RefreshCw className="w-5 h-5 text-gray-800" />
							</button>
						</div>
						<div className="flex justify-center gap-4 mt-6">
							<button
								onClick={() => setShowCamera(false)}
								className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
								Cancel
							</button>
							<button
								onClick={capturePhoto}
								className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
								<Camera className="w-5 h-5" />
								Capture Photo
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default UserSignup;
