import { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";
import Webcam from "react-webcam";
import { FilePlus, Camera, RefreshCw, Eye, EyeOff, Car } from "lucide-react";
import toast from "react-hot-toast";

function CaptainSignup() {
	const navigate = useNavigate();
	const { setCaptain } = useContext(CaptainDataContext);
	const webcamRef = useRef(null);
	const fileInputRef = useRef(null);

	// User and image states
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [previewURL, setPreviewURL] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [confirmShowPassword, setConfirmShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");

	// Vehicle states
	const [vehicleColor, setVehicleColor] = useState("");
	const [vehiclePlate, setVehiclePlate] = useState("");
	const [vehicleCapacity, setVehicleCapacity] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [model, setModel] = useState("");

	// Webcam states
	const [showCamera, setShowCamera] = useState(false);
	const [facingMode, setFacingMode] = useState("user");

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

	const openFileSelect = () => {
		fileInputRef.current.click();
	};

	const openCameraPanel = () => {
		setShowCamera(true);
	};

	const capturePhoto = async () => {
		const imageSrc = webcamRef.current.getScreenshot();
		if (imageSrc) {
			const blob = await fetch(imageSrc).then((res) => res.blob());
			const file = new File([blob], "captured-image.jpg", { type: blob.type });
			setProfileImage(file);
			setPreviewURL(imageSrc);
		}
		setShowCamera(false);
	};

	const toggleFacingMode = () => {
		setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
	};

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

	const submitHandler = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("firstname", firstName);
		formData.append("lastname", lastName);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("mobileNumber", mobileNumber);
		if (profileImage) formData.append("profileImage", profileImage);

		formData.append("color", vehicleColor);
		formData.append("plate", vehiclePlate);
		formData.append("capacity", vehicleCapacity);
		formData.append("vehicleType", vehicleType);
		formData.append("model", model);

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

			// const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, formData, {
			// 	headers: { "Content-Type": "multipart/form-data" },
			// });

			await toast
				.promise(
					axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, formData, {
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
						setCaptain(data.message.captain);
						localStorage.setItem("token", data.message.token);

						// Reset form fields
						setEmail("");
						setFirstName("");
						setLastName("");
						setPassword("");
						setMobileNumber("");
						setProfileImage(null);
						setPreviewURL(null);
						setVehicleColor("");
						setVehiclePlate("");
						setVehicleCapacity("");
						setVehicleType("");
						setModel("");

						navigate("/captain-login");
					}
				});
		} catch (error) {
			console.error("Error during captain registration:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
				<div className="flex justify-center mb-8">
					<Car className="w-20 h-20 text-blue-500" />
				</div>

				<form onSubmit={submitHandler} className="space-y-6">
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

					{/* Personal Information */}
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

					{/* Vehicle Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
								<input
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
									type="text"
									placeholder="Toyota Camry"
									value={model}
									onChange={(e) => setModel(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
								<input
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
									type="text"
									placeholder="Black"
									value={vehicleColor}
									onChange={(e) => setVehicleColor(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Passenger Capacity
								</label>
								<input
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
									type="text"
									placeholder="4"
									value={vehicleCapacity}
									onChange={(e) => setVehicleCapacity(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
								<input
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
									type="text"
									placeholder="ABC123"
									value={vehiclePlate}
									onChange={(e) => setVehiclePlate(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
							<select
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								value={vehicleType}
								onChange={(e) => setVehicleType(e.target.value)}>
								<option value="" disabled>
									Select Vehicle Type
								</option>
								<option value="car">Car</option>
								<option value="auto">Auto</option>
								<option value="moto">Moto</option>
							</select>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
						Create Captain Account
					</button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link to="/captain-login" className="text-blue-600 hover:text-blue-700 font-medium">
							Login here
						</Link>
					</p>
				</form>

				<p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
					This site is protected by reCAPTCHA and the{" "}
					<a href="#" className="text-blue-600 hover:text-blue-700">
						Google Privacy Policy
					</a>{" "}
					and{" "}
					<a href="#" className="text-blue-600 hover:text-blue-700">
						Terms of Service
					</a>{" "}
					apply.
				</p>
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

export default CaptainSignup;
