import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaptainSignup() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [vehicleColor, setVehicleColor] = useState("");
	const [vehiclePlate, setVehiclePlate] = useState("");
	const [vehicleCapacity, setVehicleCapacity] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [model, setModel] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [profileImage, setProfileImage] = useState(null);

	const { setCaptain } = useContext(CaptainDataContext);

	const submitHandler = async (e) => {
		e.preventDefault();

		// Prepare form data to include profile image as well
		const formData = new FormData();
		formData.append("firstname", firstName);
		formData.append("lastname", lastName);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("mobileNumber", mobileNumber);
		if (profileImage) formData.append("profileImage", profileImage); // Append image if provided

		formData.append("color", vehicleColor);
		formData.append("plate", vehiclePlate);
		formData.append("capacity", vehicleCapacity);
		formData.append("vehicleType", vehicleType);
		formData.append("model", model);

		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, formData, {
				headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type for FormData
			});
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
				setVehicleColor("");
				setVehiclePlate("");
				setVehicleCapacity("");
				setVehicleType("");
				setModel("");

				navigate("/captain-login");
			}
		} catch (error) {
			console.error("Error during captain registration:", error);
		}
	};

	return (
		<div className="py-5 px-5 h-screen flex flex-col justify-between">
			<div>
				<img className="w-20 mb-3" src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

				<form className="mb-10" onSubmit={submitHandler}>
					<h3 className="text-lg w-full font-medium mb-2">What&apos;s our Captain&apos;s name</h3>
					<div className="flex gap-4 mb-7">
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="First name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="Last name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<h3 className="text-lg font-medium mb-2">What&apos;s our Captain&apos;s email</h3>
					<input
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
						type="email"
						placeholder="email@example.com"
					/>

					<h3 className="text-lg font-medium mb-2">Enter Password</h3>
					<input
						className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						type="password"
						placeholder="password"
					/>

					<h3 className="text-lg font-medium mb-2">Mobile Number</h3>
					<input
						required
						value={mobileNumber}
						onChange={(e) => setMobileNumber(e.target.value)}
						className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
						type="text"
						placeholder="123-456-7890"
					/>

					<h3 className="text-lg font-medium mb-2">Profile Image</h3>
					<input
						type="file"
						onChange={(e) => setProfileImage(e.target.files[0])}
						className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
					/>

					<h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
					<div className="flex gap-4 mb-7">
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="Vehicle Color"
							value={vehicleColor}
							onChange={(e) => setVehicleColor(e.target.value)}
						/>
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="Vehicle Plate"
							value={vehiclePlate}
							onChange={(e) => setVehiclePlate(e.target.value)}
						/>
					</div>

					<div className="flex gap-4 mb-7">
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="Vehicle Capacity"
							value={vehicleCapacity}
							onChange={(e) => setVehicleCapacity(e.target.value)}
						/>
						<input
							required
							className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
							type="text"
							placeholder="Model"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						/>
					</div>

					<h3 className="text-lg font-medium mb-2">Vehicle Type</h3>
					<select
						required
						className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
						value={vehicleType}
						onChange={(e) => setVehicleType(e.target.value)}>
						<option value="" disabled>
							Select Vehicle Type
						</option>
						<option value="car">Car</option>
						<option value="auto">Auto</option>
						<option value="moto">Moto</option>
					</select>

					<button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
						Create Captain Account
					</button>
				</form>

				<p className="text-center">
					Already have an account?{" "}
					<Link to="/captain-login" className="text-blue-600">
						Login here
					</Link>
				</p>
			</div>

			<div>
				<p className="text-[10px] mt-6 leading-tight">
					This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span>{" "}
					and <span className="underline">Terms of Service apply</span>.
				</p>
			</div>
		</div>
	);
}

export default CaptainSignup;
