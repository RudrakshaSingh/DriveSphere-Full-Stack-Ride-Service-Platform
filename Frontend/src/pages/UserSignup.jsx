import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Webcam from "react-webcam";
import { FilePlus, Camera } from "lucide-react";
import {toast} from "react-hot-toast";

function UserSignup() {
	// User and image states
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [previewURL, setPreviewURL] = useState(null);

	// Webcam-related states
	const [showCamera, setShowCamera] = useState(false);
	const [facingMode, setFacingMode] = useState("user"); //"user" typically refers to the front-facing camera (for selfies), while "environment" refers to the rear camera.

	const navigate = useNavigate();
	const { user,setUser } = useContext(UserDataContext);
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

	// Handle form submission
	const submitHandler = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);
		formData.append("firstname", firstName);
		formData.append("lastname", lastName);
		if (profileImage) formData.append("profileImage", profileImage);

		try {
			await toast.promise(
			  axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			  }),
			  {
				loading: "Signing up...",
				success: "Signup successful! Redirecting...",
				error: "Error during signup",
			  }
			).then((response) => {
			  if (response.status === 201) {
				const data = response.data;
				setUser(data.message.user);
				
				localStorage.setItem("token", data.message.token);
		  
				// Reset form states
				setEmail("");
				setPassword("");
				setFirstName("");
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
		<div className="p-7 flex flex-col justify-between h-screen">
			<div>
				<img
					className="w-16 mb-10"
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
					alt="Logo"
				/>

				<form onSubmit={submitHandler}>
					<div className="mb-6">
						<h3 className="text-lg font-medium mb-2">Profile Image</h3>
						<div className="flex flex-col items-center gap-2">
							{previewURL ? (
								<div className="relative">
									<img
										src={previewURL}
										alt="Preview"
										className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
									/>
									<button
										type="button"
										onClick={removeImage}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
										×
									</button>
								</div>
							) : (
								<>
									{/* File selection icon */}
									<button type="button" onClick={openFileSelect} className="focus:outline-none">
										<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
											<FilePlus className="w-6 h-6 text-gray-400" />
										</div>
									</button>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
									{/* Capture image icon placed under the file select icon */}
									<button
										type="button"
										onClick={openCameraPanel}
										className="mt-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600"
										title="Capture Image">
										<Camera className="w-5 h-5 text-white" />
									</button>
								</>
							)}
						</div>
					</div>

					<h3 className="text-lg font-medium mb-2">What&apos;s your name</h3>
					<div className="flex gap-4 mb-6">
						<input
							required
							className="bg-gray-50 w-1/2 rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="text"
							placeholder="First name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<input
							required
							className="bg-gray-50 w-1/2 rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="text"
							placeholder="Last name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<h3 className="text-lg font-medium mb-2">What&apos;s your email</h3>
					<input
						required
						className="bg-gray-50 mb-6 rounded-lg px-4 py-3 border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="email"
						placeholder="email@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<h3 className="text-lg font-medium mb-2">Enter your password</h3>
					<input
						required
						className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg">
						Create account
					</button>
				</form>
				<p className="text-center">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600">
						Login here
					</Link>
				</p>
			</div>

			<div>
				<p className="text-[10px] leading-tight">
					This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span>{" "}
					and <span className="underline">Terms of Service apply</span>.
				</p>
			</div>

			{/* Webcam capture modal */}
			{showCamera && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white rounded-lg p-4">
						<div className="relative">
							<Webcam
								audio={false}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								videoConstraints={{
									width: 1280,
									height: 720,
									facingMode: facingMode,
								}}
								className="rounded"
							/>
							<button
								onClick={toggleFacingMode}
								className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded">
								Flip Camera
							</button>
						</div>
						<div className="flex justify-between mt-4">
							<button
								onClick={() => setShowCamera(false)}
								className="bg-gray-500 text-white py-2 px-4 rounded">
								Cancel
							</button>
							<button onClick={capturePhoto} className="bg-blue-500 text-white py-2 px-4 rounded">
								Capture
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default UserSignup;
